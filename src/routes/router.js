import express from "express";
const router = express.Router();

import {
  createAdmin,
  loginAdmin,
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../Controller/adminController.js";
import {
  addCourse,
  deleteCourse,
  getcourse,
  getcourseById,
  updateCourse,
} from "../Controller/courseController.js";
import {
  addContact,
  updateUserByAdmin,
  deleteByAdmin,
  getmessage,
  getmessageById,
} from "../Controller/contactUsController.js";

import { authentication } from "../middleware/auth.js";
import { body, check } from "express-validator";

//------------------- admin api ----------------------------//

router.post(
  "/admin/register",
  [
    body("name")
      .notEmpty()
      .withMessage("name is require")
      .isString()
      .withMessage("name must be in string"),

    body("phone")
      .notEmpty()
      .withMessage("phone number is require")
      .isString()
      .withMessage("Phone number is in string")
      .isMobilePhone()
      .withMessage("Mobile  number is not valid"),

    body("email")
      .notEmpty()
      .withMessage("email is require")
      .trim()
      .isEmail()
      .withMessage("enter valid email"),

    body("password")
      .notEmpty()
      .trim()
      .withMessage("password must be present")
      .isStrongPassword()
      .withMessage(
        "Length of the password must be between 8 to 15 characters , atleast use one Uppercase and one unique characters"
      ),

    body("roles")
      .notEmpty()
      .isIn(["primary", "secondary"])
      .withMessage("roles must be  primary or secondary"),
  ],
  createAdmin
);
router.post(
  "/admin/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email is require")
      .trim()
      .isEmail()
      .withMessage("enter valid email"),

    body("password")
      .notEmpty()
      .trim()
      .withMessage("password must be present")
      .isStrongPassword()
      .withMessage(
        "Length of the password must be between 8 to 15 characters , atleast use one Uppercase and one unique characters"
      ),
  ],
  loginAdmin
);

router.get("/admin/alladmin", authentication, getAllAdmin);

router.get("/admin/getadmin/:adminId", authentication, getAdminById);

router.patch(
  "/admin/update/:adminId",
  authentication,
  [
    body("name").optional().isString().withMessage("name must be in string"),
    body("phone")
      .optional()
      .isString()
      .withMessage("Phone number is in string")
      .isMobilePhone()
      .withMessage("Mobile  number is not valid"),
    body("email").optional().isEmail().withMessage("enter valid email"),
    body("password")
      .optional()
      .isStrongPassword()
      .withMessage(
        "Length of the password must be between 8 to 15 characters , atleast use one Uppercase and one unique characters"
      ),
    body("roles")
      .optional()
      .isIn(["primary", "secondary"])
      .withMessage("roles must be  primary or secondary"),
  ],
  updateAdmin
);

router.delete("/admin/delete/:adminId", authentication, deleteAdmin);

//-------------------- course api --------------------------//

router.post(
  "/course/add",
  authentication,
  [
    body("title")
      .notEmpty()
      .withMessage("title must be present")
      .isString()
      .withMessage("title must be in string"),
    body("description")
      .notEmpty()
      .withMessage("mrp should be present")
      .isArray()
      .withMessage("description must be in Array"),
      body("description.*")
      .notEmpty()
      .withMessage("inside description string should be present")
      .isString()
      .withMessage("inside description it will be string"),
    body("mrp")
      .notEmpty()
      .withMessage("mrp should be present")
      .isInt()
      .withMessage("mrp must be numaric value"),
    body("price")
      .notEmpty()
      .withMessage("price should be present")
      .isInt()
      .withMessage("mrp must be numaric value"),
    body("syllabus")
      .notEmpty()
      .withMessage("Sylabbus must be require")
      .isArray()
      .withMessage("Sylabbus should be in the array"),
    check("syllabus.*.topic")
      .notEmpty()
      .withMessage("syllabus topic must be present")
      .isString()
      .withMessage("Syllabus topic must be in String"),
    check("syllabus.*.addTopic")
      .notEmpty()
      .withMessage("addTopic must be present")
      .isArray()
      .withMessage("Syllabus topic must be in String"),
    body("duration")
      .notEmpty()
      .withMessage("duration should be present")
      .isInt()
      .withMessage("duration must be numaric value"),
    body("instructor")
      .notEmpty()
      .withMessage("instructor must be present")
      .isString()
      .withMessage("instructor topic must be in String"),
    body("category")
      .notEmpty()
      .isIn(["science","technology","business","arts"])
      .withMessage("category must be science, arts , technology, business"),
  ],
  addCourse
);
router.get("/course/find", getcourse);
router.get("/course/find/:courseId", getcourseById);
router.put("/course/update/:courseId", authentication, updateCourse);
router.delete("/course/delete/:courseId", authentication, deleteCourse);

//--------------------- contact us -------------------------//

router.post("/contact/add", addContact);
router.get("/contact/message", authentication, getmessage);
router.get("/contact/message/:contactId", authentication, getmessageById);
router.patch("/contact/update/:contactId", authentication, updateUserByAdmin);
router.delete("/contact/delete/:contactId", authentication, deleteByAdmin);

export default router;
