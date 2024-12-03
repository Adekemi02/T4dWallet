import {
  generateAccessToken,
  isValidPassword,
} from "../../utils/helper.functions";
import { ILogin, ILoginServiceResult } from "../interfaces/login.interface";
import { findByEmail } from "../queries/signup.queries";

/**
 * Authenticates a user and generates an access token upon successful login.
 *
 * @param data - The login credentials containing email and password.
 * @returns An object containing the authenticated user and a generated access token.
 * @throws An error if the email is not associated with any user or if the password is invalid.
 */
export const loginService = async (
  data: ILogin
): Promise<ILoginServiceResult> => {
  const { password, email } = data;

  const userExist = await findByEmail({ email });

  if (!userExist) throw new Error("Invalid school id");

  if (!(await isValidPassword(password, userExist.password_hash)))
    throw new Error("Invalid Password");

  const token = generateAccessToken(userExist.id);

  return {
    user: userExist,
    token,
  };
};
