import { Router } from "express";
import { UserController } from "../users/controller/user-controller";
import { imageUpload } from "../utils/multer";
import { authorizeUser } from "../midllewares/auth-middleware";
import { validateBody } from "../midllewares/validate";
import { FundWalletDTO } from "./dtos/wallet.dto";
import { deactivateWalletController, fundWalletController, getUserWalletController, reactivateWalletController } from "./controllers/wallet.controller";
import { TransferFundController } from "./controllers/transfer.controller";
import { TransferFundsDTO } from "./dtos/transfer.dto";
import { getAllTransactionsByWalletController } from "../transactions/controllers/transaction.controller";

const router = Router();

router.post("/fund", validateBody(FundWalletDTO), authorizeUser, fundWalletController as any);
router.post("/transfer", validateBody(TransferFundsDTO), authorizeUser, TransferFundController as any);
router.get("", authorizeUser, getUserWalletController as any);
router.get("/wallet-transaction", authorizeUser, getAllTransactionsByWalletController as any);
router.patch("/reactivate/:walletId", authorizeUser, reactivateWalletController as any);
router.delete("/deactivate/:walletId", authorizeUser, deactivateWalletController as any);

export default router;
