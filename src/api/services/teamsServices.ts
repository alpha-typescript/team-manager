import IResult from "../../interfaces/iResult";
import ITeam from "../../interfaces/iTeam";
import teamsRepositories from "../repositories/teamsRepositories";
class TeamsServices {
    async list(): Promise<IResult<ITeam[]>> {
        let result: IResult<ITeam[]> = { errors: [], status: 200 };
        try {
            result = await teamsRepositories.list();
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
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
