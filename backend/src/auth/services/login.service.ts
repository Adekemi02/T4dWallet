import { generateAccessToken, isValidPassword } from "../../utils/helper.functions";
import { ILogin, ILoginServiceResult } from "../interfaces/login.interface";
import { findByEmail } from "../queries/signup.queries";

export const loginService = async (data: ILogin): Promise<ILoginServiceResult> => {
     const { password, email } = data;

     const userExist = await findByEmail({ email });

     if (!userExist) throw new Error('Invalid school id');

     if (!(await isValidPassword(password, userExist.password_hash))) throw new Error('Invalid Password');  

     const token = generateAccessToken(userExist.id)

     return {
          user: userExist,
          token,
      };
}