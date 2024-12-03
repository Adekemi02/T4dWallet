import { successHandler, errorHandler } from "../../utils/helper.functions";
import { LoginDTO } from "../dtos/login.dto";
import { Request, Response } from "express";
import { loginService } from "../services/login.service";

export const loginController = async (req: Request, res: Response) => {
  try {
    const data: LoginDTO = req.body;

    const validateUser = await loginService(data);

    const response = {
      id: validateUser.user.id,
      firstName: validateUser.user.first_name,
      lastName: validateUser.user.last_name,
      email: validateUser.user.email,
      authToken: validateUser.token,
    };

    return successHandler(res, "Login successful", response);
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message);
  }
};
