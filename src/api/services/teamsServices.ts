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
                    result.status = 403;
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
                    result.status = 403;
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
                    result.status = 403;
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
        let result: IResult<ITeam> = { errors: [], status: 201 };
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
                    result.status = 403;
                    break;
                case "['leader'] field is missing":
                    result.status = 400;
                    break;

                case "[field 'leader'] id does not belong to any user":
                    result.status = 404;
                    break;
                case "[field 'leader'] this user is admin, so can not be a leader":
                    result.status = 400; //coloquei 403 mas preciso verificar se corresponde mesmo
                    break;
                case "[field 'leader'] this user has already a team, so can not be a leader":
                    result.status = 400; //coloquei 403 mas preciso verificar se corresponde mesmo
                    break;
                default:
                    result.status = 500;
                    break;
            }
            result.errors?.push(error.message);
        }
        return result;
    }
    async removeMember(
        adminUser: IUser,
        commonUser: string,
        teamId: string
    ): Promise<IResult<IUser[]>> {
        let result: IResult<IUser[]> = { errors: [], status: 200 };
        try {
            if (adminUser.id == commonUser) {
                throw new Error("A leader can't remove itself from a team");
            }

            if (await usersRepositories.isLeader(commonUser)) {
                throw new Error("You can't remove a leader from the team");
            }

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

    async addUser(
        teamId: string,
        userId: string,
        user: IUser
    ): Promise<IResult<IUser>> {
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
                    result.status = 403;
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

    async update(
        teamId: string,
        newName: string,
        newLeaderId: string
    ): Promise<IResult<IUser[]>> {
        let result: IResult<IUser[]> = { errors: [], status: 200 };
        try {
            if (!(await teamsRepositories.exists(teamId))) {
                throw new Error("Team does not exist");
            }

            if (!newLeaderId && !newName) {
                throw new Error(
                    "Missing new leader name or new name for the team"
                );
            }

            if (await usersRepositories.isLeader(newLeaderId)) {
                throw new Error("This user is already a leader");
            }

            if (!(await teamsRepositories.hasMember(teamId, newLeaderId))) {
                throw new Error("This user is not a member of the team");
            }

            result = await teamsRepositories.update(
                teamId,
                newName,
                newLeaderId
            );
        } catch (error: any) {
            switch (error.message) {
                case "Team does not exist":
                    result.status = 404;
                    break;
                case "Missing new leader name or new name for the team":
                    result.status = 400;
                    break;
                case "This user is already a leader":
                    result.status = 400;
                    break;
                case "This user is not a member of the team":
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

    async deleteTeam(user: IUser, teamId: string): Promise<IResult<ITeam>> {
        let result: IResult<ITeam> = { errors: [], status: 200 };
        try {
            const membersResult = (await teamsRepositories.members(teamId))
                .data as IUser[]; //check if team has members
            if (user.isAdmin && membersResult.length <= 1) {
                result = await teamsRepositories.deleteTeam(teamId);
            } else {
                throw new Error("User doesn't have permission");
            }
        } catch (error: any) {
            switch (error.message) {
                case "User doesn't have permission":
                    result.status = 403;
                    break;
                case "User not found":
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
}

const teamsServices = new TeamsServices();
export default teamsServices;
