import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import teamsServices from "../services/teamsServices";
import IUser from "../../interfaces/iUser";
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

    async removeMember(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const adminUser: IUser = payload.user;

            const result = await teamsServices.removeMember(adminUser, req.params.user_id, req.params.team_id);
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
