import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function createValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = (req.query.errors as string[]) || [];
  const { username, firstName, lastName, email, password, squad, isAdmin } =
    req.body;
  errors = [...errors, ...Validator.isValidName(username)];
  errors = [...errors, ...Validator.isValidEmail(email)];
  errors = [...errors, ...Validator.isValidName(firstName)];
  errors = [...errors, ...Validator.isValidName(lastName)];
  errors = [...errors, ...Validator.isValidPassword(password)];
  errors = [...errors, ...Validator.isValidId(squad)];
  errors = [...errors, ...Validator.isValidBool(isAdmin)];

  req.query.errors = errors;

  next();
}
