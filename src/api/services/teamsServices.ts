import IResult from "../../interfaces/iResult";
import ITeam from "../../interfaces/iTeam";
import IUser from "../../interfaces/iUser";
import teamsRepositories from "../repositories/teamsRepositories";
import usersRepositories from "../repositories/usersRepositories";
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

    async insert(newTeam: ITeam, user: IUser): Promise<IResult<ITeam>> {
        let result: IResult<ITeam> = { errors: [], status: 200 };
        try {
            //se usuário não é admin não pode fazer essa adição
            if (!user.isAdmin) {
                throw new Error("User doesn't have permission");
            }
            //se {leader} não existe, bad request
            if (!newTeam.leader) {
                throw new Error("['leader'] field is missing");
            }
            //se {leader} existe, mas não há nenhum usuario com esse id, retorna erro
            if (
                newTeam.leader &&
                !(await usersRepositories.exists(newTeam.leader))
            ) {
                throw new Error(
                    "[field 'leader'] id does not belong to any user"
                );
            }

            //se {leader} existe e o usuário é adm, não pode ser leader
            if (
                newTeam.leader &&
                (await usersRepositories.isAdmin(newTeam.leader))
            ) {
                throw new Error(
                    "[field 'leader'] this user is admin, so can not be a leader"
                );
            }

            //se {leader} existe e o usuário ja está em um time (lider ou funcionario normal)
            // não pode ser leader
            if (
                newTeam.leader &&
                (await usersRepositories.hasAlreadyTeam(newTeam.leader))
            ) {
                throw new Error(
                    "[field 'leader'] this user has already a team, so can not be a leader"
                );
            }

            result = await teamsRepositories.insert(newTeam);
            //se chegou aqui significa que deu tudo certo e o novo time foi criado
            //e o campo "team" do usuario foi atualizado, deixando de ser null e passando
            //a ser o id do time recem criado
        } catch (error: any) {
            switch (error.message) {
                case "User doesn't have permission":
                    result.status = 401;
                    break;
                case "['leader'] field is missing":
                    result.status = 400;
                    break;

                case "[field 'leader'] id does not belong to any user":
                    result.status = 404;
                    break;
                case "[field 'leader'] this user is admin, so can not be a leader":
                    result.status = 403; //coloquei 403 mas preciso verificar se corresponde mesmo
                    break;
                case "[field 'leader'] this user has already a team, so can not be a leader":
                    result.status = 403; //coloquei 403 mas preciso verificar se corresponde mesmo
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
