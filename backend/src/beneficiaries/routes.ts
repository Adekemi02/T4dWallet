import { Router } from "express";
import { authorizeUser } from "../midllewares/auth-middleware";
import { validateBody, validateParams } from "../midllewares/validate";
import {
  saveNewBeneficiaryController,
  getBeneficiariesController,
  deleteBeneficiaryController,
  getOneBeneficiaryController,
  searchBeneficiariesController,
} from "./controllers/beneficiary.controller";
import {
  NewBeneficiaryDTO,
  GetOneBeneficiaryDTO,
  SearchBeneficiariesDTO,
} from "./dtos/beneficiary.dto";

const router = Router();

router.post(
  "/new",
  validateBody(NewBeneficiaryDTO),
  authorizeUser,
  saveNewBeneficiaryController as any
);
router.get("/", authorizeUser, getBeneficiariesController as any);
router.delete(
  "/:beneficiaryId/remove",
  validateParams(GetOneBeneficiaryDTO),
  authorizeUser,
  deleteBeneficiaryController as any
);
router.get(
  "/:beneficiaryId",
  validateParams(GetOneBeneficiaryDTO),
  authorizeUser,
  getOneBeneficiaryController as any
);
router.post(
  "/search",
  validateBody(SearchBeneficiariesDTO),
  authorizeUser,
  searchBeneficiariesController as any
);

export default router;
