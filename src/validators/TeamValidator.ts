import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function TeamValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = (req.query.errors as string[]) || [];
  const { name, leader } = req.body;

  if (name) {
    errors = [...errors, ...Validator.isValidName(name)];
  }

  if (leader) {
    errors = [...errors, ...Validator.isValidId(leader)];
  }

  req.query.errors = errors;

  next();
}
