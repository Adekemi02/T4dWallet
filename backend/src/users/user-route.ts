import { Router } from "express";
import { UserController } from "../users/controller/user-controller";
import { imageUpload } from "../utils/multer";
import { authorizeUser } from "../midllewares/auth-middleware";

const router = Router();

router.put("/:id", authorizeUser, UserController.editUser as any);  
router.post("/:id/profile-picture", imageUpload.single("image"),authorizeUser, UserController.updateUserProfilePicture as any)
router.delete("/:id", authorizeUser, UserController.deleteUserProfilePicture as any); 

export default router;
