import {
  RequestWithUser,
  successHandler,
  errorHandler,
} from "../../utils/helper.functions";
import {
  GetOneBeneficiaryDTO,
  NewBeneficiaryDTO,
  SearchBeneficiariesDTO,
} from "../dtos/beneficiary.dto";
import { Request, Response } from "express";
import {
  deleteBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
  saveNewBeneficiary,
  searchBeneficiaries,
} from "../services/beneficiary.service";

export const saveNewBeneficiaryController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: NewBeneficiaryDTO = req.body;
    const beneficiary = await saveNewBeneficiary(data, req.user);

    return successHandler(res, "Beneficiary saved successfully", {});
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "Could not set wallet pin");
  }
};

export const deleteBeneficiaryController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const beneficiaryId = req.params.beneficiaryId;
    const beneficiary = await deleteBeneficiary(beneficiaryId, req.user);

    return successHandler(res, "Beneficiary deleted successfully", beneficiary);
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "Could not save beneficiary");
  }
};

export const getBeneficiariesController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const beneficiaries = await getBeneficiaries(req.user);

    return successHandler(
      res,
      "Beneficiaries retrieved successfully",
      beneficiaries
    );
  } catch (error: any) {
    console.log(error);
    return errorHandler(
      res,
      error.message || "Could not retrieve beneficiaries"
    );
  }
};

export const getOneBeneficiaryController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const beneficiaryId = req.params.beneficiaryId;
    const beneficiary = await getBeneficiaryById(beneficiaryId, req.user);

    return successHandler(res, "Beneficiary saved successfully", beneficiary);
  } catch (error: any) {
    console.log(error);
    return errorHandler(
      res,
      error.message || "Could not retrieve beneficiaries"
    );
  }
};

export const searchBeneficiariesController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: SearchBeneficiariesDTO = req.body;
    const beneficiary = await searchBeneficiaries(data.query, req.user);

    return successHandler(
      res,
      "Beneficiary retrieved successfully",
      beneficiary
    );
  } catch (error: any) {
    console.log(error);
    return errorHandler(
      res,
      error.message || "Could not retrieve beneficiaries"
    );
  }
};
