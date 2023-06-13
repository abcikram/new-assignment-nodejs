import express from "express";
const router = express.Router();

import {
    addCourse,
    deleteCourse,
    getcourse,
    getcourseById,
    updateCourse,
    updateTopicOnly,
  } from "../Controller/courseController.js";

import { authentication ,PrimaryAuthentication} from "../middleware/auth.js";
import { body, check, param, query } from "express-validator";


//-------------------- course api --------------------------//

router.post(
    "/add",
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
  
  router.get("/find",[
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
  
  router.get("/find/:courseId",[
    param('courseId')
       .isMongoId()
       .withMessage("contactId is not validate"),
  ],getcourseById);
  
  router.put("/update/:courseId",authentication, [
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
  
  
  router.put("/update/:courseId/:topicId",authentication,  updateTopicOnly);
  
  
  router.delete("/delete/:courseId", authentication,
  [
    param('courseId')
       .isMongoId()
       .withMessage("contactId is not validate"),
  ], deleteCourse);
  


export default router