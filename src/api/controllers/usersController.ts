import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import usersServices from "../services/usersServices";
import IUser from "../../interfaces/iUser";

class UsersController {
    async list(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await usersServices.list(user);
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
            console.log("TESTE", req.body, "TESTE");

            const newUser: IUser = {
                id: req.body.id,
                username: req.body.username,
                email: req.body.email,
                firstName: req.body.firsName,
                lastName: req.body.lastName,
                team: req.body.team,
                isAdmin: req.body.isAdmin,
            };

            const result = await usersServices.insert(newUser);
            console.log(result);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            console.log(error.message);
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const errors: string[] = (req.query.errors as string[]) || [];

            if (errors.length > 0) {
                return res.status(422).json({ errors });
            }

            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const patchUser: IUser = {
                id: user.id,
                username: req.body.username || user.username,
                email: req.body.email || user.email,
                firstName: req.body.firstName || user.firstName,
                lastName: req.body.lastName || user.lastName,
                password: req.body.password || user.password
            };

            const result = await usersServices.patch(patchUser, req.params.user_id);
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

const usersController = new UsersController();

export default usersController;
