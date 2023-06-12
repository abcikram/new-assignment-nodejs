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
  updateTopicOnly,
} from "../Controller/courseController.js";
import {
  addContact,
  updateUserByAdmin,
  deleteByAdmin,
  getmessage,
  getmessageById,
} from "../Controller/contactUsController.js";

import { authentication ,PrimaryAuthentication} from "../middleware/auth.js";
import { body, check, param, query } from "express-validator";

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
    param("adminId").isMongoId().withMessage("adminId is not validate"),
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
  PrimaryAuthentication,
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
      .isInt({min:1})
      .withMessage("mrp must be numaric value"),
    body("price")
      .notEmpty()
      .withMessage("price should be present")
      .isInt({min:1})
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
      .isInt({min:1})
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

router.get("/course/find",[
  query("title")
  .optional()
  .isString()
  .withMessage("title is in string amd alphabetical "),
query("category")
   .optional()
   .isIn(["science", "technology", "business", "arts"])
   .withMessage("category must be science , technology, business, arts"),
query("sort")
   .optional()
   .isString()
   .withMessage("sort is in string"),
  query("instructor")
   .optional()
   .isString()
   .withMessage("Instructor is in string"),
], getcourse);

router.get("/course/find/:courseId",[
  param('courseId')
     .isMongoId()
     .withMessage("contactId is not validate"),
],getcourseById);

router.put("/course/update/:courseId",authentication, [
  body("title")
    .optional()
    .isString()
    .withMessage("title must be in string"),
  body("description")
    .optional()
    .isArray()
    .withMessage("description must be in Array"),
  body("description.*")
    .notEmpty()
    .withMessage("inside description string should be present")
    .isString()
    .withMessage("inside description it will be string"),
  body("mrp")
    .optional()
    .isInt({min:1})
    .withMessage("mrp must be numaric value"),
  body("price")
    .optional()
    .isInt({min:1})
    .withMessage("mrp must be numaric value"),
  body("syllabus")
    .optional()
    .isArray()
    .withMessage("Sylabbus should be in the array"),
  check("syllabus.*.topic")
    .optional()
    .isString()
    .withMessage("Syllabus topic must be in String"),
  check("syllabus.*.addTopic")
    .optional()
    .isArray()
    .withMessage("Syllabus topic must be in String"),
  body("duration")
    .optional()
    .isInt({min:1})
    .withMessage("duration must be numaric value"),
  body("instructor")
    .optional()
    .isString()
    .withMessage("instructor topic must be in String"),
  body("category")
    .optional()
    .isIn(["science","technology","business","arts"])
    .withMessage("category must be science, arts , technology, business"),
],  updateCourse);


router.put("/course/update/:courseId/:topicId",authentication,  updateTopicOnly);


router.delete("/course/delete/:courseId", authentication,
[
  param('courseId')
     .isMongoId()
     .withMessage("contactId is not validate"),
], deleteCourse);


//===================================== contact us ================================================//

router.post("/contact/add",[
  body("name")
      .notEmpty()
      .withMessage("name is require")
      .isString().isAlpha()
      .withMessage("name is alphabetical order"),
  body("email")
      .notEmpty()
      .withMessage("email is require")
      .trim()
      .isEmail()
      .withMessage("enter valid email"),
  body("mobileNumber")
      .notEmpty()
      .withMessage("phone number is require")
      .isString()
      .withMessage("Phone number is in string")
      .isMobilePhone()
      .withMessage("Mobile  number is not valid"),
 body("message")
       .notEmpty()
       .withMessage("Message is required")
       .isString()
       .withMessage("Message is in string"),
 body("status")
       .optional()
       .isIn(["new","contacted"])
       .withMessage("status must be new, contacted"),
  
], addContact);
router.get("/contact/message", authentication,[
  query("name")
  .optional()
  .isString().isAlpha()
  .withMessage("name is in string amd alphabetical "),
query("status")
   .optional()
   .isIn(["new","contacted"])
   .withMessage("status must be new, contacted"),
query("sort")
   .optional()
   .isString()
   .withMessage("sort is in string")
],getmessage);

router.get("/contact/message/:contactId", authentication,
[
  param('contactId')
     .isMongoId()
     .withMessage("contactId is not validate"),
], getmessageById);

router.patch("/contact/update/:contactId", authentication,
 [
    param('contactId')
        .isMongoId()
        .withMessage("contactId is not validate"),
    body("status")
        .optional()
        .isIn(["new","contacted"])
        .withMessage("status must be new, contacted"),
    body("note")
        .optional()
        .isString()
        .withMessage("Note should is in the string")
  ],updateUserByAdmin);

router.delete("/contact/delete/:contactId", authentication,
   [
      param('contactId')
         .isMongoId()
         .withMessage("contactId is not validate"),
   ]
,deleteByAdmin);

export default router;
