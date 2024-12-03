import { Router } from "express";
import {
  resendOTPControler,
  signupController,
  verifyOTPController,
} from "./controllers/signup.controller";
import { validateBody, validateParams } from "../midllewares/validate";
import { ResendOTPDTO, SignupDTO, VerifyOTPDTO } from "./dtos/signup.dto";
import { ForgotPasswordDTO, ResetPasswordDTO } from "./dtos/password.dto";
import {
  forgotPasswordController,
  resetPasswordController,
} from "./controllers/password.controller";
import { LoginDTO } from "./dtos/login.dto";
import { loginController } from "./controllers/login.controller";

const router = Router();

router.post("/signup", validateBody(SignupDTO), signupController);
router.post(
  "/forgot-password",
  validateBody(ForgotPasswordDTO),
  forgotPasswordController
);
router.post(
  "/reset-password",
  validateBody(ResetPasswordDTO),
  resetPasswordController
);
router.post("/verify-otp", validateBody(VerifyOTPDTO), verifyOTPController);
router.post("/login", validateBody(LoginDTO), loginController);
router.post(
  "/resend-otp/:email",
  validateParams(ResendOTPDTO),
  resendOTPControler
);

export default router;
