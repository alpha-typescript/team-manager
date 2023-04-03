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
}

const teamsRepositories = new TeamsRepositories();
export default teamsRepositories;
