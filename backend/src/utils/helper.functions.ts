import { Response, Request } from "express";
import { IUser, User } from "../auth/models/user.model";
import { DecodedToken, IOTPResponse } from "./types";
import { readFileSync } from "fs";
import path from "path";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";
import { IWallet, Wallet } from "../wallets/models/wallet.model";

/**
 * Sends a successful JSON response.
 *
 * This function constructs a JSON response with a status code of 200, indicating
 * a successful operation. It includes a message and optional data payload.
 *
 * @param res - The Express response object.
 * @param message - A message describing the success.
 * @param data - An optional data payload to include in the response.
 *
 * @returns The JSON response object.
 */
export function successHandler(res: Response, message: string, data: any): any {
  return res.json({
    statusCode: 200,
    status: "success",
    success: true,
    message,
    data,
  });
}

/**
 * Sends an error JSON response.
 *
 * This function constructs a JSON response with a specified error status code.
 * It includes an error message and a success flag set to false.
 *
 * @param res - The Express response object.
 * @param message - A message describing the error.
 * @param code - The HTTP status code for the error (defaults to 500).
 *
 * @returns void
 */
export function errorHandler(
  res: Response,
  message: string,
  code: number = 500,
  error?: any
) {
  res.status(code).json({
    statusCode: code,
    status: "error",
    success: false,
    message,
    error: error ? error.message : undefined,
  });
}

/**
 * Extended Request interface to include user data.
 *
 * This interface extends the Express Request interface to include additional
 * properties related to user information and file validation errors.
 */
export interface RequestWithUser extends Request {
  fileValidationError: any;
  user: IUser;
  wallet: IWallet;
}

/**
 * Generates a One-Time Password (OTP) and its expiration time.
 *
 * This function creates a random 6-digit OTP and calculates its expiration time.
 * The OTP is valid for 5 minutes from the time of generation.
 *
 * @returns An object containing the generated OTP and its expiration time.
 *          - otp: The generated OTP as a string.
 *          - expiresAt: The Date object indicating when the OTP expires.
 */
export const generateOTP = (): IOTPResponse => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds

  return {
    otp,
    expiresAt,
  };
};

export const monthsExpiry = (numberOfMonths: number): Date => {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + numberOfMonths);
  return expiresAt;
};

/**
 * Reads an HTML email template from the file system.
 *
 * This function constructs the file path for a specified email template and reads
 * the contents of the template file synchronously. The template should be located in
 * the 'templates' directory relative to the current module's directory.
 *
 * @param templateName - The name of the email template to be read (without the .html extension).
 *
 * @returns A string containing the HTML content of the email template.
 *          If the template does not exist or cannot be read, an error will be thrown.
 */
export const readEmailTemplate = (templateName: string): string => {
  const emailTemplatePath = path.join(
    __dirname,
    "../",
    "templates",
    `${templateName}.html`
  );
  return readFileSync(emailTemplatePath, "utf-8");
};

/**
 * Hashes a password using bcrypt.
 *
 * This function generates a salt and uses it to hash the provided password.
 * The hashing process is asynchronous and uses a cost factor of 10.
 *
 * @param password - The plaintext password to be hashed.
 *
 * @returns A Promise that resolves to the hashed password as a string.
 *
 * @throws Error if an error occurs during the hashing process.
 *         The error message will indicate the nature of the error.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await genSalt(10);
    return await hash(password, salt);
  } catch (error) {
    console.log(error);
    throw new Error("error occured while hashing password");
  }
}

/**
 * Checks if an OTP has expired.
 *
 * @param expiresAt - The expiration date of the OTP.
 * @returns `true` if the current date is past the expiration date; otherwise, `false`.
 */
export const isOTPExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

export const generateAccessToken = (userid: string): string => {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }

  const signedToken = jwt.sign({ userid: userid }, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return signedToken;
};

export const verifyAccessToken = (
  token: string,
  secret: string
): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export async function isValidPassword(
  passwordPlainText: string,
  hashedPassword: string
) {
  try {
    const isValid = await compare(passwordPlainText, hashedPassword);
    console.log(isValid);

    return isValid;
  } catch (error) {
    console.log(error);
    throw new Error("failed comparison");
  }
}

export const generateULIDForEntity = (entityCodePrefix: string) => {
  return entityCodePrefix + ulid();
};

// export const cloneObj = <T = object>(obj: T): T => structuredClone(obj);

/**
 * Clones a Mongoose document safely.
 */
export const cloneObj = (document: any) => {
  if (document.toObject && typeof document.toObject === "function") {
    // Convert Mongoose document to a plain object
    return document.toObject();
  }
  // Use JSON methods for non-Mongoose objects
  return JSON.parse(JSON.stringify(document));
};

export function generateRandomNumber(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const generateWalletId = async (): Promise<string> => {
  let isUnique = false;
  const id = generateRandomNumber(7);

  do {
    const existingWallet = await Wallet.findOne({
      wallet_id: id,
    }).exec();
    if (!existingWallet) {
      isUnique = true;
    }
  } while (!isUnique);

  return `110${id}`;
};

export function formatTransactionDate(date: Date): string {
  // Format the date as MM/DD/YYYY, HH:mm:ss AM/PM
  const formattedDate = date.toLocaleString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}

// Function to format number with commas
export function formatNumberWithComma(number: number): string {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
