import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import teamsServices from "../services/teamsServices";
import IUser from "../../interfaces/iUser";
import ITeam from "../../interfaces/iTeam";
class TeamsController {
    async list(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await teamsServices.list(user);
            console.log(result);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            console.log(error.message);
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
            console.log(result);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            console.log(error.message);
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
            console.log(result);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            console.log(error.message);
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async insert(req: Request, res: Response) {
        try {
            //const errors: string[] = (req.query.errors as string[]) || [];

            //if (errors.length > 0) {
            //    return res.status(422).json({ errors });
            // }

            //if you reached here, it's because in req.body everything is ok!
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const newTeam: ITeam = {
                id: req.body.id,
                name: req.body.name,
                leader: req.body.leader,
            };

            const result = await teamsServices.insert(newTeam, user);
            console.log(result);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            console.log(error.message);
            return res.status(500).json({ errors: [error.message] });
        }
    }
}

const teamsController = new TeamsController();

export default teamsController;
