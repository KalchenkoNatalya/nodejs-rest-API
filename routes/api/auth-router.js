import express from "express";
import * as userSchema from "../../models/User.js";

import {validateBody} from "../../decorators/index.js";
import authController from "../../controllers/userControllers.js"

const authRouter = express.Router();
const userSignUpValidate = validateBody(userSchema.userSignUpSchema)
const userSigniNValidate = validateBody(userSchema.userSignInSchema)

authRouter.post("/register", userSignUpValidate, authController.signup)
authRouter.post("/login", userSigniNValidate, authController.signin  )

export default authRouter;
