import jwt from "jsonwebtoken";

import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;
// console.log("JWT_SECRET:", JWT_SECRET);
// console.log(process.env)
const authenticate = async (req, res, next) => {

  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");
  console.log("bearer:", bearer);
  console.log(token);

  console.log("req.user authenticate:", req.user);

  if (bearer !== "Bearer") {
    throw HttpError(401);
    // throw HttpError(401, error.message("not Bearer"));
  }
   console.log("токен перед verify: ", token)
  console.log("JWT_SECRET:", JWT_SECRET);

  const validation = jwt.verify(token, JWT_SECRET);
  console.log("validation:", validation)

  const { id } = jwt.verify(token, JWT_SECRET);
   console.log("id:", id)
  try {
    console.log("try catch початок")
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log("id:", id)

    const user = await User.findById(id);
    console.log("user:", user)
    console.log("req.user authenticate, user:", req.user);
    if (!user || !user.token) {
      throw HttpError(401);
      // throw HttpError(401, error.message("not user"));
    }
    req.user = user;
    console.log("Authentication successful.");
    // console.log(req.user);
    next();
  } catch {
    console.error("Authentication error:");
    throw HttpError(401);
  }
};

export default ctrlWrapper(authenticate);
