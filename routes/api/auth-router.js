import express from "express";
import * as userSchema from "../../models/User.js";

import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/authController.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchema.userSignUpSchema);
const userSigniNValidate = validateBody(userSchema.userSignInSchema);

authRouter.post("/register",  userSignUpValidate, authController.signup);
authRouter.post("/login", userSigniNValidate, authController.signin);


authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
