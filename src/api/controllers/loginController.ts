import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import loginServices from "../services/loginServices";
import ILogin from "../../interfaces/iLogin";

class LoginController {
    async login(req: Request, res: Response) {
        try {
            const errors: string[] = (req.query.errors as string[]) || [];

            if (errors.length > 0) {
                return res.status(422).json({ errors });
            }

            const credentials: ILogin = {
                username: req.body.username,
                password: req.body.password,
            };

            const result = await loginServices.comparePassword(credentials);

            if (result.status === 200) {
                const jwt = jwtLib.sign(
                    { user: result.data },
                    process.env.JWTSECRET || "senha secreta"
                );
                res.cookie("session", jwt);
                return res.status(result.status || 500).json({
                    message: `User '${credentials.username}' logged in successfully`,
                });
            }

            return res.status(result.status || 500).json(result.errors);
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const payload = jwtLib.decode(req.cookies["session"]) as JwtPayload;
            const username: string = payload.user.username;

            res.clearCookie("session");
            return res.status(200).json({
                message: `User '${username}' logged out successfully`,
            });
        } catch (error: any) {
            return res.status(500).json({ errors: [error.message] });
        }
    }
}

const loginController = new LoginController();

export default loginController;
