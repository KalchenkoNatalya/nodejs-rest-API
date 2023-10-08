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
  avatarURL: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify code is required"],
  },
});

userSchema.post("save", handleSaveError);

// userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
userSchema.pre("updateOne", runValidateAtUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignUpSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "Не вілідний пароль. Не менше 6 символів",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Не вілідний імейл.",
  }),
  subscription: Joi.string(),
});

export const userSignInSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "Помилка від Joi або іншої бібліотеки валідації>",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Помилка від Joi або іншої бібліотеки валідації>",
  }),
});

export const userUpdateSubscription = Joi.object({
  subscription: Joi.string().required().messages({
    "any.required":
      "subscription is required, type 'starter', 'pro', 'business'",
  }),
});
export const userEmailSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({ "any.required": "email is required" }),
});
const User = model("user", userSchema);

export default User;
