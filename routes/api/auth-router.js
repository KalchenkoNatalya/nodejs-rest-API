import express from "express";
import * as userSchema from "../../models/User.js";

import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/authController.js";
import { authenticate, upload } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchema.userSignUpSchema);
const userSigniNValidate = validateBody(userSchema.userSignInSchema);
const userUpdateValidate = validateBody(userSchema.userUpdateSubscription);
const userEmailValidate = validateBody(userSchema.userEmailSchema);

authRouter.post("/register", userSignUpValidate, authController.signup);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", userEmailValidate, authController.resentVerifyEmail);
authRouter.post("/login", userSigniNValidate, authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);
authRouter.patch(
  "/",
  authenticate,
  userUpdateValidate,
  authController.updateSubscription
);
authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.updateAvatar
);

export default authRouter;
