import { Request, Response } from "express";
import usersServices from "../services/usersServices";

class UsersController {
    async list(req: Request, res: Response) {
        try {
            const result = await usersServices.list();
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
            const result = await usersServices.insert(req.body);
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
