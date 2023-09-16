import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", runValidateAtUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignUpSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "Помилка від Joi або іншої бібліотеки валідації>",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Помилка від Joi або іншої бібліотеки валідації>",
  }),
  subscription: Joi.string().required(),
});

export const userSignInSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model("user", userSchema);

export default User;
