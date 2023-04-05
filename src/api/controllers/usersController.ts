import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import usersServices from "../services/usersServices";
import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import { v4 as uuidV4 } from "uuid";

class UsersController {
    async list(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;

            const result = await usersServices.list(user);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async insert(req: Request, res: Response) {
        try {
            let errors: string[] = (req.query.errors as string[]) || [];

            //verify if a field is missing

            const { username, firstName, lastName, email, password } = req.body;

            const fields = [username, firstName, lastName, email, password];

            const fieldsName = [
                "username",
                "firstName",
                "lastName",
                "email",
                "password",
            ];

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

            const newUser: IUser = {
                id: uuidV4(),
                username: req.body.username,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                team: null,
                isAdmin: false,
            };

            const result = await usersServices.insert(newUser);
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
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
                password: req.body.password || user.password,
            };

            const result = await usersServices.patch(
                patchUser,
                req.params.user_id
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;
            const result = await usersServices.getUser(
                user,
                req.params.user_id
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;
            const result = await usersServices.deleteUser(
                user,
                req.params.user_id
            );
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const result: IResult<IUser> = { errors: [], status: 200 };
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const user: IUser = payload.user;
            result.data = user;
            return res.status(result.status || 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }
}

const usersController = new UsersController();

export default usersController;
