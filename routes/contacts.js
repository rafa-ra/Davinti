const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const contactControllers = require("../controllers/contacts");

router.get("/contacts", contactControllers.getContacts);
// router.post("/contacts", contactControllers.postSearchContacts);
router.get("/", contactControllers.getContacts);

router.get("/add-contact", contactControllers.getAddContact);
router.post(
  "/add-contact",
  [
    body("name").isString().isLength({ min: 3 }).trim(),
    body("age").isInt({ min: 1, max: 130 }),
    body("telephone1").isLength({ min: 16 }),
    body("telephone2").optional({ checkFalsy: true }).isLength({ min: 16 }),
  ],
  contactControllers.postAddContact
);

router.get("/edit-contact/:contactId", contactControllers.getEditContact);
router.post(
  "/edit-contact",
  [
    body("name").isString().isLength({ min: 3 }),
    body("age").isInt({ min: 1, max: 130 }),
    body("telephone1").isLength({ min: 16 }),
    body("telephone2").optional({ checkFalsy: true }).isLength({ min: 16 }),
  ],
  contactControllers.postEditContact
);

router.post("/delete-contact", contactControllers.deleteContact);

module.exports = router;
