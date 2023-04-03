import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function createValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = (req.query.errors as string[]) || [];
  const { name, leader } = req.body;
  errors = [...errors, ...Validator.isValidName(name)];
  errors = [...errors, ...Validator.isValidId(leader)];

  req.query.errors = errors;

  next();
}
