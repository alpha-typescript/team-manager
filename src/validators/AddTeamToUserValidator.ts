import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function AddTeamToUserValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let errors: string[] = (req.query.errors as string[]) || [];
    const { team_id, user_id } = req.params;
    errors = [...errors, ...Validator.isValidId(team_id)];
    errors = [...errors, ...Validator.isValidId(user_id)];

    req.query.errors = errors;

    next();
}