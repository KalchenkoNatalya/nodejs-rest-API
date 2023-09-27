import express from "express";
import ctrl from "../../controllers/contactsControllers.js";
// import * as ctrl from "../../controllers/contacts/index.js";
import contactSchemas from "../../schemas/contactsSchema.js";
import validateBody from "../../decorators/validateBody.js";
import { authenticate, upload,  isValidId } from "../../middlewares/index.js";

const contactsAddValidate = validateBody(contactSchemas.contactAddSchema);
const contactsUpdateFavoriteValidate = validateBody(
  contactSchemas.contactsUpdateFavoriteSchema
);

const contactsRouter = express.Router();



contactsRouter.get("/", authenticate, ctrl.getAllContacts);


contactsRouter.get("/:id", authenticate, isValidId, ctrl.getById);

contactsRouter.post("/", upload.single("poster"), authenticate, contactsAddValidate, ctrl.addContact);

contactsRouter.delete("/:id", authenticate, isValidId, ctrl.removeContactById);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  contactsAddValidate,
  ctrl.updateContactById
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  contactsUpdateFavoriteValidate,
  ctrl.updateStatusContact
);

export default contactsRouter;
