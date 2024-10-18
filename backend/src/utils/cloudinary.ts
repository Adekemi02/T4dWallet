import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { errorHandler } from "./helper.functions";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileToUpload: string) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    deleteFromDiskStorage(fileToUpload);
    return data;
  } catch (error: unknown) {
    deleteFromDiskStorage(fileToUpload);
    const cloudinaryErr = error as Error;
    if (cloudinaryErr.name === "TimeoutError") {
      throw new Error("Request Timeout, please try again");
    }
    throw new Error(
      `Internal Server Error (cloudinary), ${error as Error}`
    );
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return error;
  }
};

export const extractCloudinaryPublicId = (imageUrl: string) => {
    const parts = imageUrl.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0]; 
    return publicId;
  };
  
const deleteFromDiskStorage = (filePath: string) => {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
        throw new Error(`Internal Server Error (disk), ${error}`);
    }
}
  