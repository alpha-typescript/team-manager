import { NextFunction, Request, Response } from "express";
import jwtLib from "jsonwebtoken";
import { config } from "dotenv";
config({ path: "config/.env" });

export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        jwtLib.verify(
            req.cookies["session"],
            process.env.JWTSECRET || "senha secreta"
        );
        next();
    } catch (error: any) {
        res.status(401).json({ errors: [error.message] });
    }
}
