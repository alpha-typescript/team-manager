import IResult from "../../interfaces/iResult";
import ITeam from "../../interfaces/iTeam";
import IUser from "../../interfaces/iUser";
import teamsRepositories from "../repositories/teamsRepositories";
class TeamsServices {
    async list(user: IUser): Promise<IResult<ITeam[]>> {
        let result: IResult<ITeam[]> = { errors: [], status: 200 };
        try {
            if (user.isAdmin || user.isLeader) {
                result = await teamsRepositories.list();
            } else {
                throw new Error("User doesn't have permission");
            }
        } catch (error: any) {
            result.errors?.push(error.message);
            if (error.message === "User doesn't have permission") {
                result.status === 401;
            } else {
                result.status = 500;
            }
        }
        return result;
    }

    async getTeam(teamId: string, user: IUser): Promise<IResult<ITeam>> {
        let result: IResult<ITeam> = { errors: [], status: 200 };
        try {
            const team = await teamsRepositories.find(teamId);
            if (user.isAdmin || user.isLeader || user.team === team.data?.id) {
                result = team;
            } else {
                throw new Error("User doesn't have permission");
            }
        } catch (error: any) {
            result.errors?.push(error.message);
            if (error.message === "User doesn't have permission") {
                result.status === 401;
            } else {
                result.status = 500;
            }
        }
        return result;
    }

    /*     async insert(product: IProduct): Promise<IResult<IProduct>> {
        const pool = await Postgres.pool();
        let result: IResult<IProduct> = { errors: [], status: 200 };
        try {
            result = await this.repository.insert(pool, product);
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }
 */
}

const teamsServices = new TeamsServices();
export default teamsServices;
