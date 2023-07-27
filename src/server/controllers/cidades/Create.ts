import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";

interface ICidade {
  nome: string;
  estado: string;
}

const bodyValidation: yup.Schema<ICidade> = yup.object().shape({
  nome: yup.string().required().min(3),
  estado: yup.string().required().min(2),
});

export const createBodyValidator: RequestHandler = async (req, res, next) => {
  try {
    await bodyValidation.validate(req.body, {
      abortEarly: false,
    });
    return next();
  } catch (err) {
    const yupError = err as yup.ValidationError;
    const erros: Record<string, string> = {};

    console.log(yupError);
    yupError.inner.forEach((error) => {
      if (error.path === undefined) return;
      erros[error.path] = error.message;
    });
    return res.status(StatusCodes.BAD_REQUEST).json({ erros });
  }
};

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  return res.status(StatusCodes.CREATED).send(req.body);
};