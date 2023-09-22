import Contact from "../models/Contact.js";
import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
 
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const { _id: owner } = req.user;
  const isFavorite = req.query.favorite;

  
  if (isFavorite) {
    const { favorite } = req.query;
    const filter = favorite === "true" ? { favorite: true } : {};
    try {
      const result = await Contact.find(filter);
      res.json({ message: "filtered succesful", result });
    } catch (err) {
      res.status(500).json({ error: "Помилка сервера" });
    }
  }

  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.json(result);
};


const getById = async (req, res) => {
  const { id } = req.params;
  const owner = req.user._id;

  const result = await Contact.findOne({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `id ${id} not found`);
  }

  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(newContact);
};


const removeContactById = async (req, res) => {
  const { _id: owner } = req.user;

  const { id } = req.params;

  const result = await Contact.findOneAndDelete({ _id: id, owner });
  if (!result) throw HttpError(404, `id=${id} not found`);

  res.json({ message: `contact id=${id} deleted` });
};

const updateContactById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  const { _id: owner } = req.user;

  const { favorite } = req.body;
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { favorite },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};


export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  removeContactById: ctrlWrapper(removeContactById),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
