import { Router } from "express";
import { UserController } from "../users/controller/user-controller";
import { imageUpload } from "../utils/multer";
import { authorizeUser } from "../midllewares/auth-middleware";
import { validateBody } from "../midllewares/validate";
import { FundWalletDTO } from "./dtos/wallet.dto";
import { fundWalletController, getUserWalletController } from "./controllers/wallet.controller";
import { TransferFundController } from "./controllers/transfer.controller";
import { TransferFundsDTO } from "./dtos/transfer.dto";

const router = Router();

router.post("/fund", validateBody(FundWalletDTO), authorizeUser, fundWalletController as any);
router.post("/transfer", validateBody(TransferFundsDTO), authorizeUser, TransferFundController as any);
router.get("", authorizeUser, getUserWalletController as any);

export default router;
