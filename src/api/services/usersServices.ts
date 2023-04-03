import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import userRepositories from "../repositories/usersRepositories";
class UsersServices {
    async list(user: IUser): Promise<IResult<IUser[]>> {
        let result: IResult<IUser[]> = { errors: [], status: 200 };
        try {
            if (user.isAdmin) {
                result = await userRepositories.list();
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

    async insert(user: IUser): Promise<IResult<IUser>> {
        let result: IResult<IUser> = { errors: [], status: 200 };
        try {
            result = await userRepositories.insert(user);
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

const usersServices = new UsersServices();
export default usersServices;
