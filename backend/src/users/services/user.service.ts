import { isValidObjectId, Types } from "mongoose";
import { User, IUser } from "../../auth/models/user.model"
import { deleteFromCloudinary, extractCloudinaryPublicId, uploadToCloudinary } from "../../utils/cloudinary"


export class UserService {
  static async editUser(
    userId: string | Types.ObjectId,
    userData: Partial<IUser>
  ) {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user Id");
    }

    const user = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (user == null) {
      throw new Error("user does not exist");
    }

    return user;
  }

  // Add user profile picture
  static async updateUserProfilePicture(
    userId: Types.ObjectId,
    reqFile: string | null
  ) {
    let imageUpload;
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (reqFile) {
        imageUpload = await uploadToCloudinary(reqFile);
        user.image = imageUpload.secure_url;

        await user.save();
      }
      return user;
    } catch (error) {
      if (imageUpload) {
        await deleteFromCloudinary(imageUpload.public_id);
      }
      throw error;
    }
  };
  
   // Add user profile picture
  static async deleteUserProfilePicture(userId: Types.ObjectId) {

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.image) {
      throw new Error("No profile picture to delete");
    }

    const publicId = extractCloudinaryPublicId(user.image);

    await deleteFromCloudinary(publicId);

    user.image = '';
    await user.save();

    return user;
  };

  static async getUserById(userId: Types.ObjectId | string) {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);

    return user;
  }

}