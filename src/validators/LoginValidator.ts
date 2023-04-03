import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function LoginValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = (req.query.errors as string[]) || [];
  const { username, password } = req.body;
  errors = [...errors, ...Validator.isValidName(username)];
  errors = [...errors, ...Validator.isValidPassword(password)];

  req.query.errors = errors;

  next();
}
