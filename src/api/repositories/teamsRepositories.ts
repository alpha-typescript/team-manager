import ITeam from "../../interfaces/iTeam";
import IResult from "../../interfaces/iResult";
import ConnectDB from "../database/postgres";
import IUser from "../../interfaces/iUser";

class TeamsRepositories {
    private db = new ConnectDB();

    public async exists(teamId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT EXISTS (SELECT 1 FROM teams WHERE id = $1);`,
            [teamId]
        );
        return result[0].exists;
    }

    public async hasMember(teamId: string, userId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT EXISTS (SELECT 1 FROM users WHERE team = $1 AND id = $2);`,
            [teamId, userId]
        );
        return result[0].exists;
    }

    public async list(): Promise<IResult<ITeam[]>> {
        const result: IResult<ITeam[]> = { errors: [], status: 200 };

        try {
            const teamsResult = await this.db.query(`SELECT * FROM teams`);
            result.data = [];

            if (teamsResult.length === 0) throw new Error("No teams found");

            teamsResult.forEach((teamResult) => {
                const team: ITeam = {
                    id: teamResult.id,
                    name: teamResult.name,
                    leader: teamResult.leader,
                };
                result.data?.push(team);
            });
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async find(teamId: string): Promise<IResult<ITeam>> {
        const result: IResult<ITeam> = { errors: [], status: 200 };

        try {
            const teamResult = await this.db.query(
                `
                SELECT * FROM teams
                WHERE id = $1;
                `,
                [teamId]
            );

            const team: ITeam = {
                id: teamResult[0].id,
                name: teamResult[0].name,
                leader: teamResult[0].leader,
            };
            result.data = team;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async members(teamId: string): Promise<IResult<IUser[]>> {
        const result: IResult<IUser[]> = { errors: [], status: 200 };

        try {
            const usersResult = await this.db.query(
                `
                SELECT * FROM users
                WHERE team = $1;
                `,
                [teamId]
            );

            result.data = [];
            usersResult.forEach((userResult) => {
                const user: IUser = {
                    id: userResult.id,
                    username: userResult.username,
                    email: userResult.email,
                    firstName: userResult.first_name,
                    lastName: userResult.last_name,
                    team: userResult.team,
                    isAdmin: userResult.is_admin,
                };
                result.data?.push(user);
            });
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async insert(newTeam: ITeam): Promise<IResult<ITeam>> {
        const result: IResult<ITeam> = { errors: [], status: 200 };

        try {
            const insertTeamQueryText = `
            INSERT INTO teams (id,name,leader) VALUES ($1,$2,$3) RETURNING *;
            `;

            const insertTeamValues = [
                newTeam.id || null,
                newTeam.name || null,
                newTeam.leader || null,
            ];
            const insertTeamResult = await this.db.query(
                insertTeamQueryText,
                insertTeamValues
            );
            result.data = {};

            if (insertTeamResult.length === 0)
                throw new Error("Team was not created");

            const updateUserQueryText = `
                UPDATE users SET team = $1 WHERE id = $2;
                `;

            const updateUserValues = [insertTeamValues[0], insertTeamValues[2]];
            await this.db.query(updateUserQueryText, updateUserValues);

            const team: ITeam = {
                id: insertTeamResult[0].id,
                name: insertTeamResult[0].name,
                leader: insertTeamResult[0].leader,
            };

            result.data = team;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }
        return result;
    }
    public async removeMember(
        memberId: string,
        teamId: string
    ): Promise<IResult<IUser[]>> {
        const result: IResult<IUser[]> = { errors: [], status: 200 };

        try {
            const query = `
                UPDATE users
                    set team = null
                WHERE
                    users.id = $1
                AND
                    users.team = $2
                RETURNING 
                    *`;
            const removeResult = await this.db.query(query, [memberId, teamId]);

            if (removeResult.length == 0) {
                throw new Error("This user is not a member of this team");
            }

            result.data = removeResult;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async insertUser(
        teamId: string,
        userId: string
    ): Promise<IResult<IUser>> {
        const result: IResult<IUser> = { errors: [], status: 200 };

        try {
            const userResult = await this.db.query(
                `
                UPDATE users SET 
                team = $1
                WHERE id = $2
                RETURNING *
                `,
                [teamId, userId]
            );

            const user: IUser = {
                id: userResult[0].id,
                username: userResult[0].username,
                email: userResult[0].email,
                firstName: userResult[0].first_name,
                lastName: userResult[0].last_name,
                team: userResult[0].team,
                isAdmin: userResult[0].is_admin,
            };

            result.data = user;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async update(
        teamId: string,
        newName: string | null,
        newLeaderId: string | null
    ): Promise<IResult<IUser[]>> {
        const result: IResult<IUser[]> = { errors: [], status: 200 };

        try {
            if (newName) {
                const query = `
                    UPDATE 
                        teams 
                    SET 
                        name = $1
                    WHERE
                        id = $2
                    `;
                await this.db.query(query, [newName, teamId]);
            }

            if (newLeaderId) {
                const query = `
                    UPDATE 
                        teams 
                    SET 
                        leader = $1
                    WHERE
                        id = $2
                    `;
                await this.db.query(query, [newLeaderId, teamId]);
            }

            const updateResult = await this.db.query(
                "SELECT * FROM teams WHERE id = $1",
                [teamId]
            );

            result.data = updateResult;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async deleteTeam(teamId: string): Promise<IResult<ITeam>> {
        const result: IResult<ITeam> = { errors: [], status: 200 };
        try {
            const teamResult = await this.db.query(
                `
                UPDATE users SET team = null WHERE team = $1;
                DELETE FROM teams WHERE id = $1
                RETURNING *;
                `,
                [teamId]
            );

            if (teamResult.length === 0) throw new Error("Team not found");

            const team: ITeam = {
                id: teamResult[0].id,
                name: teamResult[0].name,
                leader: teamResult[0].leader,
            };

            result.data = team;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }
}

const teamsRepositories = new TeamsRepositories();
export default teamsRepositories;
