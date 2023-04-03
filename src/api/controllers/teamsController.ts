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

            const result = await teamsServices.list(user);
            console.log(result);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            console.log(error.message);
            return res.status(500).json({ errors: [error.message] });
        }
    }
    /* async insert(req: Request, res: Response) {
        try {
            const errors: string[] = (req.query.errors as string[]) || [];

            if (errors.length > 0) {
                return res.status(422).json({ errors });
            }

            //const result = await this.service.insert(req.body);
            //return res.status(result.status || 500).json(result);
            return res.status(200).json({ data: req.body });
        } catch (error: any) {
            console.log("Erro ao inserir o produto", error.message);
            return res.status(500).json({ errors: [error.message] });
        }
    } */
}

const teamsController = new TeamsController();

export default teamsController;
