import Contact from "../models/Contact.js";
import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
  // console.log(
  //   "потрапляє в контроллер getAllContacts і приходить req.user:",
  //   req.user
  // );
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const owner = req.user._id;
  // const { _id: owner } = req.user; // теж саме, що і 24 рядок

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

// const removeContactById11 = async (req, res) => {
//   const { id: contactId } = req.params;
//   const { _id: owner } = req.user;

//   const contact = await Contact.findById(contactId);
//   // console.log("contact.owner.toString():", contact.owner.toString())
//   // console.log("owner.toString():", owner.toString())
//   // console.log(contact.owner.toString() === owner.toString())
//   if (!contact) {
//     throw HttpError(404, `Contact with id=${contactId} not found`);
//   }

//   if (contact.owner.toString() !== owner.toString()) {
//     throw HttpError(403, "This is not your contact");
//   }

//   await Contact.findByIdAndDelete(contactId);
//   res.json({ message: "Contact deleted" });
// };

const removeContactById = async (req, res) => {
  const { _id: owner } = req.user;

  const { id } = req.params;
  console.log(id);
  const result = await Contact.findOneAndDelete({ _id: id, owner });
  if (!result) throw HttpError(404, `id=${id} not found`);

  res.json({ message: `contact id=${id} deleted` });
};

// const updateContactById111 = async (req, res) => {
//   const { id } = req.params;
//   const { _id: owner } = req.user;
//   const result = await Contact.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   // console.log(result);
//   if (!result) {
//     throw HttpError(404, `Contact with id=${id} not found`);
//   }

//   res.json(result);
// };
const updateContactById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate({_id: id, owner}, req.body, {
    new: true,
    runValidators: true,
  });
  // console.log(result);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};
const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    {
      new: true,
      runValidators: true,
    }
  );
  // console.log(result);
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
