import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  console.log("user:", user);

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  console.log(user._id);

  const { _id: id } = user;
  const payload = { id };
  console.log("payload.id:", payload.id);

  // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" }); - при такому рядку пише,
  //що немає значення ключа, тому огорнула в обернені дужки, так працює

  const token = jwt.sign(payload, `${JWT_SECRET}`, { expiresIn: "23h" });

  // console.log("token:", token);
  await User.findByIdAndUpdate(id, { token }); // зберігаємо токен в базі даних перед тим, як відправити відповідь на фронтенд
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  // console.log("req.user getCurrent:", req.user);

  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "user succesfull logout" });
};
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
};
