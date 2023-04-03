import ITeam from "../../interfaces/iTeam";
import IResult from "../../interfaces/iResult";
import ConnectDB from "../database/postgres";

class TeamsRepositories {
    private db = new ConnectDB();

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
