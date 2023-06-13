import express from "express";
const router = express.Router();

import {
    createAdmin,
    loginAdmin,
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    forgetPassword,
    resetPassword,
    sendOtpvarificationEmail,
    verifyOTP,
    resendOTP
  } from "../Controller/adminController.js";

import { authentication ,PrimaryAuthentication} from "../middleware/auth.js";
import { body, param, query } from "express-validator";


//------------------- admin api ----------------------------//

router.post(
    "/register",
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
    "/login",
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
  
  router.get("/alladmin", authentication, getAllAdmin);
  
  router.get("/getadmin/:adminId", authentication, getAdminById);
  
  router.patch(
    "/update/:adminId",
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
  
  router.delete("/delete/:adminId", authentication, deleteAdmin);
  
 router.post('/forget-password',forgetPassword);
 router.get('/reset-password',resetPassword);
 router.post('/forget-password-with-otp',sendOtpvarificationEmail);
 router.post('/verifyotp',verifyOTP)
router.post('/resend-otp-validation', resendOTP)
export default router