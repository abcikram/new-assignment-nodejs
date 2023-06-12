import Contact from "../models/contactUsModel.js";
import Admin from "../models/adminModel.js";
import { matchedData, validationResult } from "express-validator";


//addContactUsdata :-

export const addContact = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const createUser = await Contact.create(req.body);

    res.status(201).send({
      status: true,
      message: "Contact is added successfully",
      data: createUser,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


// getContact :-
export const getmessage = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }
    const data = matchedData(req);

    const filter = {};

    if (data.name) {
      filter.name = { $regex: data.name, $options: "i" }; // $options:"i" means insansitibe
      // $regex Provides regular expression capabilities for pattern matching strings in queries
    }

    if (data.status) {
      filter.status = data.status;
    }

    //------ course sort by parameters:- -----//
    let apiData = Contact.find(filter);

    if (data.sort) {
      let sortFix = data.sort.replace(",", " ");
      apiData = apiData.sort(sortFix);
    }

    //---------- course pagination ------------//
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;

    let skip = (page - 1) * limit;

    apiData = apiData.skip(skip).limit(limit);

    //call
    const userfind = await apiData;

    if (userfind.length == 0) {
      return res.status(404).send({ status: false, message: "No User found" });
    }

    res.status(200).send({ status: true, data: userfind });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


//getmessageById:-
export const getmessageById = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const data = matchedData(req);

    const contactfind = await Contact.findById(data.contactId);

    if (!contactfind)
      return res
        .status(404)
        .send({ status: false, message: "contact data is not found" });

    res.status(200).send({ status: true, data: contactfind });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



// update user status:-
export const updateUserByAdmin = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }
    const data = matchedData(req);

    const tokenId = req.userId;

    const checkAdminroles = await Admin.findById(tokenId);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    const finduser = await Contact.findById(data.contactId);

    console.log(finduser.status);

    if (finduser.status == "contacted")
      return res.send({ message: "user is already connected" });

    //authorization:-
    if (checkAdminroles.roles !== "primary") {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorize access" });
    }

    //update the status and notes :-
    const updatedMessage = await Contact.findByIdAndUpdate(
      data.contactId,
      {
        $set: data,
      },
      { new: true }
    );

    res.status(200).send({ status: true, data: updatedMessage });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


//delete Contactus :-
export const deleteByAdmin = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }
    const data = matchedData(req);

    const tokenId = req.userId;

    const checkAdminroles = await Admin.findById(tokenId);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    //authorization:-
    if (checkAdminroles.roles !== "primary") {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorize access" });
    }

    const deleteMessage = await Contact.findByIdAndDelete(data.contactId);

    res.status(200).send({ status: true, message: "contact is deleted" });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
