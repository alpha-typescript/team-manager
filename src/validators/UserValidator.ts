import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function UserValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let errors: string[] = (req.query.errors as string[]) || [];
    const { username, firstName, lastName, email, password, squad, isAdmin } =
        req.body;

    if (username) {
        errors = [...errors, ...Validator.isValidName(username)];
    }

    if (email) {
        errors = [...errors, ...Validator.isValidEmail(email)];
    }

    if (firstName) {
        errors = [...errors, ...Validator.isValidName(firstName)];
    }

    if (lastName) {
        errors = [...errors, ...Validator.isValidName(lastName)];
    }

    if (password) {
        errors = [...errors, ...Validator.isValidPassword(password)];
    }

    if (squad) {
        errors = [...errors, ...Validator.isValidId(squad)];
    }

    if (isAdmin) {
        errors = [...errors, ...Validator.isValidBool(isAdmin)];
    }

    req.query.errors = errors;

    next();
}
