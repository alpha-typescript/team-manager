import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import teamsServices from "../services/teamsServices";
import IUser from "../../interfaces/iUser";
import ITeam from "../../interfaces/iTeam";
import { v4 as uuidV4 } from "uuid";

class TeamsController {
    async list(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await teamsServices.list(user);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async getTeam(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await teamsServices.getTeam(
                req.params.team_id,
                user
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async listMembers(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await teamsServices.listMembers(
                req.params.team_id,
                user
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async insert(req: Request, res: Response) {
        try {
            let errors: string[] = (req.query.errors as string[]) || [];

            //verify if a field is missing

            const { name, leader } = req.body;

            const fields = [name, leader];

            const fieldsName = ["name", "leader"];

            let fieldsMissing: Array<string> = []; //array with fiels are missing

            fields.forEach((field, index) => {
                if (!field) {
                    fieldsMissing.push(
                        `Field '${fieldsName[index]}' is missing`
                    );
                }
            });

            if (fieldsMissing.length > 0) {
                return res.status(400).json({ errors: fieldsMissing });
            }

            if (errors.length > 0) {
                return res.status(422).json({ errors });
            }

            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const newTeam: ITeam = {
                id: uuidV4(),
                name: req.body.name,
                leader: req.body.leader,
            };

            const result = await teamsServices.insert(newTeam, user);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }
    async removeMember(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const adminUser: IUser = payload.user;

            const result = await teamsServices.removeMember(
                adminUser,
                req.params.user_id,
                req.params.team_id
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { newName, newLeaderId } = req.body;

            const result = await teamsServices.update(
                req.params.team_id,
                newName,
                newLeaderId
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async addTeamToUser(req: Request, res: Response) {
        try {
            const errors: string[] = (req.query.errors as string[]) || [];

            if (errors.length > 0) {
                return res.status(422).json({ errors });
            }

            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await teamsServices.addUser(
                req.params.team_id,
                req.params.user_id,
                user
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async deleteTeam(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;
            const result = await teamsServices.deleteTeam(
                user,
                req.params.team_id
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }
}

const teamsController = new TeamsController();

export default teamsController;
