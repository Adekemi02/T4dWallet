import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { errorHandler, RequestWithUser, successHandler } from "../../utils/helper.functions";
import { Types } from "mongoose";


export class UserController {
  static async editUser(req: RequestWithUser, res: Response) {
    try {
      const userId: Types.ObjectId = req.user._id as Types.ObjectId;
      const userData = req.body;

      const updatedUser = await UserService.editUser(userId, userData);

      return successHandler(res, "User profile updated successfully", updatedUser)

    } catch (error) {
      return errorHandler(res, "Failed to update user",)

    }
  }

  // Upload/Update profile picture
  static async updateUserProfilePicture(req: RequestWithUser, res: Response) {
    try {
      const userId: Types.ObjectId = req.user._id as Types.ObjectId;
      const file =  req.file ? req.file.path : null;

      const updatedUser = await UserService.updateUserProfilePicture(userId, file);

      return successHandler(res, "User profile updated successfully", updatedUser)

    } catch (error) {
      return errorHandler(res, "Failed to update user profile picture",)

    }
  }

  // Delete profile picture
  static async deleteUserProfilePicture(req: RequestWithUser, res: Response) {
    try {
      const userId: Types.ObjectId = req.user._id as Types.ObjectId;
      const updatedUser = await UserService.deleteUserProfilePicture(userId);

      return successHandler(res, "Profile picture deleted successfully", updatedUser)

    } catch (error) {
      return errorHandler(res, "Failed to delete profile picture",)
    }
  }
}
