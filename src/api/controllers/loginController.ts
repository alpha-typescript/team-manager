import { Request, Response } from "express";
import jwtLib from "jsonwebtoken";
import loginServices from "../services/loginServices";
import ILogin from "../../interfaces/iLogin";

class LoginController {
    async login(req: Request, res: Response) {
        try {
            //console.log("TESTE", req.body, "TESTE");

            const credentials: ILogin = {
                username: req.body.username,
                password: req.body.password,
            };

            const result = await loginServices.comparePassword(credentials);

            console.log(result);

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
            console.log(error.message);
            return res.status(500).json({ errors: [error.message] });
        }
    }
}

const loginController = new LoginController();

export default loginController;
