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
            switch (error.message) {
                case "User doesn't have permission":
                    result.status = 401;
                    break;
                default:
                    result.status = 500;
                    break;
            }
            result.errors?.push(error.message);
        }
        return result;
    }

    async getTeam(teamId: string, user: IUser): Promise<IResult<ITeam>> {
        let result: IResult<ITeam> = { errors: [], status: 200 };
        try {
            if (!(await teamsRepositories.exists(teamId)))
                throw new Error("Team does not exist");

            if (user.isAdmin || user.isLeader || user.team === teamId) {
                result = await teamsRepositories.find(teamId);
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

    async listMembers(teamId: string, user: IUser): Promise<IResult<IUser[]>> {
        let result: IResult<IUser[]> = { errors: [], status: 200 };
        try {
            if (!(await teamsRepositories.exists(teamId)))
                throw new Error("Team does not exist");

            if (user.isAdmin || user.isLeader || user.team === teamId) {
                result = await teamsRepositories.members(teamId);
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

    async removeMember(adminUser: IUser, commonUser: string, teamId: string): Promise<IResult<IUser[]>> {
        let result: IResult<IUser[]> = { errors: [], status: 200 };
        try {
            if (adminUser.id == commonUser) {
                throw new Error("A leader can't remove itself from a team");
            } 

            // validar se o usuário é admin ou n
            // if (await userRepository.getUser(commonUser).isAdmin) {
            //     throw new Error("You can't remove a leader from a team")
            // }

            if (!commonUser) {
                throw new Error("No user ID found");
            }

            result = await teamsRepositories.removeMember(commonUser, teamId);
        } catch (error: any) {
            switch (error.message) {
                case "No user ID found":
                    result.status = 400;
                    break;
                case "A leader can't remove itself from a team":
                    result.status = 403;
                    break;
                case "You can't remove a leader from a team":
                    result.status = 403;
                    break;
                case "This user is not a member of this team":
                    result.status = 400;
                    break;
                default:
                    result.status = 500;
                    break;
            }
            result.errors?.push(error.message);
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
