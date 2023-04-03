import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import userRepositories from "../repositories/usersRepositories";
import teamsRepositories from "../repositories/teamsRepositories";
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
    async getUser(user: IUser, userId: string): Promise<IResult<IUser>> {
        let result: IResult<IUser> = { errors: [], status: 200 };
        try {
            if (user.isAdmin) {
                result = await userRepositories.getUser(userId);
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
    async deleteUser(user: IUser, userId: string): Promise<IResult<IUser>> {
        let result: IResult<IUser> = { errors: [], status: 200 };
        try {
            const userDeleted = await userRepositories.getUser(userId);
            if (!(userDeleted))
                throw new Error("User does not exist");

            if (user.isAdmin || ( user.isLeader && userDeleted.data?.team == user.team)) {
                result = await userRepositories.deleteUser(userId);
                result.data = userDeleted.data;
            } else {
                throw new Error("User doesn't have permission");
            }
        } catch (error: any) {
            switch (error.message) {
                case "User doesn't have permission":
                    result.status = 401;
                    break;
                case "Team does not exist":
                    result.status = 404;
                    break;
                default:
                    result.status = 500;
                    break;
            }
            result.errors?.push(error.message);
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

    async addUser(teamId: string, userId: string, user: IUser): Promise<IResult<IUser>> {
        let result: IResult<IUser> = { errors: [], status: 200 };

        try {
            if (!(await teamsRepositories.exists(teamId)))
                throw new Error("Team does not exist");

            if (user.isAdmin || user.isLeader) {
                result = await teamsRepositories.insertUser(teamId, userId);
            } else {
                throw new Error("User doesn't have permission");
            }
        } catch (error: any) {
            switch (error.message) {
                case "User doesn't have permission":
                    result.status = 401;
                    break;
                case "Team does not exist":
                    result.status = 404;
                    break;
                default:
                    result.status = 500;
                    break;
            }
            result.errors?.push(error.message);
        }
        return result;
    }


    async patch(user: IUser, userId: string): Promise<IResult<IUser>> {
        let result: IResult<IUser> = { errors: [], status: 200 };
        try {
            if (user.id !== userId) {
                throw new Error("User can't edit other users.");
            }

            result = await userRepositories.patch(user);
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
