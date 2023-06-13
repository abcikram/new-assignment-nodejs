import express from "express";
const router = express.Router();

import { authentication ,PrimaryAuthentication} from "../middleware/auth.js";
import { body, param, query } from "express-validator";

import {
    addContact,
    updateUserByAdmin,
    deleteByAdmin,
    getmessage,
    getmessageById,
  } from "../Controller/contactUsController.js";



//===================================== contact us ================================================//

router.post("/add",[
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
  router.get("/message", authentication,[
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
  
  router.get("/message/:contactId", authentication,
  [
    param('contactId')
       .isMongoId()
       .withMessage("contactId is not validate"),
  ], getmessageById);
  
  router.patch("/update/:contactId", authentication,
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
  
  router.delete("/delete/:contactId", authentication,
     [
        param('contactId')
           .isMongoId()
           .withMessage("contactId is not validate"),
     ]
  ,deleteByAdmin);


  export default router;