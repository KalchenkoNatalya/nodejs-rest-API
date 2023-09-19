import jwt from "jsonwebtoken";

import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;



  const [bearer, token] = authorization.split(" ");
  console.log(bearer);
  console.log(token);
  console.log("req.user authenticate:", req.user);
  
  if (bearer !== "Bearer") {
    throw HttpError(401);
    // throw HttpError(401, error.message("not Bearer"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    console.log("req.user authenticate, user:", req.user);
    if (!user || !user.token) {
      throw HttpError(401);
      // throw HttpError(401, error.message("not user"));
    }
    req.user = user;
    // console.log(req.user);
    next();
  } catch {
    throw HttpError(401);
  }
};

export default ctrlWrapper(authenticate);
