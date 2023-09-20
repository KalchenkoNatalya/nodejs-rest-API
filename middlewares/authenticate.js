import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

// console.log("JWT_SECRET:", JWT_SECRET);

const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw HttpError(401);
    }
    // console.log("try catch початок");
    const { id } = jwt.verify(token, JWT_SECRET);

    // console.log("id з верифікації:", id);
    const user = await User.findById(id);
    // console.log("user:", user);
    if (!user || !user.token) {
      throw HttpError(401);
    }

    req.user = user;

    next();
  } catch {
    console.error("Authentication error:");
    throw HttpError(401);
  }
};

export default ctrlWrapper(authenticate);
