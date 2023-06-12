import Course from "../models/courseModel.js";
import Admin from "../models/adminModel.js";
import { matchedData, validationResult } from "express-validator";
import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";

export const addCourse = async (req, res) => {
  try {

      const error = validationResult(req);
      //  console.log("error:",error);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array()[0].msg });
      }

      const createCourse = await Course.create(req.body);

      res.status(201).send({
        status: true,
        message: "course is added successfully",
        data: createCourse,
      });

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//getcourse :-

export const getcourse = async (req, res) => {
  try {
    const error = validationResult(req);
      //  console.log("error:",error);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array()[0].msg });
      }
   const data =  matchedData(req)

    const filter = {};

    if (data.title) {
      filter.title = { $regex: data.title, $options: "i" }; // $options:"i" means insansitibe
      // $regex Provides regular expression capabilities for pattern matching strings in queries
    }

    if (data.instructor) {
      filter.instructor = { $regex: data.instructor, $options: "i" };
    }

    if (data.category) {
      filter.category = data.category;
    }

    //------ course sort by parameters:- -----//
    let apiData = Course.find(filter);

    if (data.sort) {
      let sortFix = data.sort.replace(",", " ");
      apiData = apiData.sort(sortFix);
    }

    //---------- course pagination ------------//
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;

    let skip = (page - 1) * limit;

    apiData = apiData.skip(skip).limit(limit);

    const coursefind = await apiData;

    if (coursefind.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "No Course found" });
    }

    res.status(200).send({ status: true, data: coursefind });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//getcourseById:-

export const getcourseById = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const data = matchedData(req);

    const coursefind = await Course.findById(data.courseId);

    if (!coursefind)
      return res
        .status(404)
        .send({ status: false, message: "course data is not found" });

    res.status(200).send({ status: true, data: coursefind });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// update course :-

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    if (!isValidObjectId(courseId))
      return res
        .status(400)
        .send({ status: false, message: "course id is not validate" });
    
    //token from middleware:-
    const userIdByToken = req.userId;

    if (!isValidObjectId(userIdByToken))
      return res
        .status(400)
        .send({ status: false, message: "Token is not validate" });

    const checkAdminroles = await Admin.findById(userIdByToken);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    //authorization:-(only primary admin can update the course)
    if (checkAdminroles.roles == "primary") {
      const error = validationResult(req);
      //  console.log("error:",error);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array()[0].msg });
      }

      const data = matchedData(req);

      const updateCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $set: data,
        },
        { new: true }
      );

      res.status(200).send({
        status: true,
        message: "course is updated successfully",
        data: updateCourse,
      });
    } else {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorize access" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

export const updateTopicOnly = async (req, res) => {
  try {
    let courseId = req.params.courseId;
    let topicId = req.params.topicId;

    console.log(courseId, topicId);

    const { topic, addTopic } = req.body;

    // const courseData = await Course.findOne({_id:courseId})
    // // console.log(courseData.syllabus[0].addTopic)

    // if(data.syllabus){
    //     let newArr = [courseData.syllabus[0].addTopic];
    //     //console.log(newArr)
    //     for (let i = 0; i < data.syllabus[0].addTopic.length; i++) {
    //       newArr.push(req.body.syllabus[0].addTopic[i]);
    //    }
    //   req.body.addTopic = newArr;
    //   console.log( req.body.addTopic)
    // }

    console.log(addTopic)

    topicId = new ObjectId(topicId);
    const updateCourse = await Course.updateOne(
      { _id: courseId,syllabus:{"$elemMatch":{
        "topic" :"semister"
      }}},
      {
        $set: {
            "syllabus.$.topic": topic,
            // "syllabus.$.addTopic": ["topic"],
            
        },
      },
      { $push: {"syllabus.$.addTopic":addTopic} },

      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "course is updated successfully",
      data: updateCourse,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//delete-Course :-

export const deleteCourse = async (req, res) => {
  try {

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const data = matchedData(req);

    const userIdByToken = req.userId;

    const checkAdminroles = await Admin.findById(userIdByToken);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    //authorization:-(only primary admin can delete course)
    if (checkAdminroles.roles !== "primary") {
        return res
        .status(403)
        .send({ status: false, message: "Unauthorize access" });
    }

      const courseDelete = await Course.deleteOne({ _id: data.courseId });

      res.status(200).send({ status: true, message: "The course is delete successfully" });
    
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
