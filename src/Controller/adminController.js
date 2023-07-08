import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { Result, matchedData, validationResult } from "express-validator";
import randomstring from "randomstring";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import UserOtpVarification from "../models/otpvarificationModel.js";
import fast2sms from 'fast-two-sms'


//Admin register:-

export const createAdmin = async (req, res) => {
  try {
    //today I learn:-
    const error = validationResult(req);
    //  console.log("error:",error);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const data = matchedData(req);
    //console.log(data)

    //encripted password:-
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(data.password, salt);
    req.body.password = newPassword;

    const admin = await Admin.create(req.body);

    return res
      .status(201)
      .json({ status: true, message: "admin is created", data: admin });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//Admin login:-

export const loginAdmin = async (req, res) => {
  try {
    const error = validationResult(req);
    //  console.log("error:",error);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    // check email for admin
    let adminEmail = await Admin.findOne({ email: req.body.email });
    if (!adminEmail)
      return res.status(400).send({
        status: false,
        message: "Email is not correct, Please provide valid email",
      });

    const checkpass = await bcrypt.compare(
      req.body.password,
      adminEmail.password
    );

    // console.log(checkpass);

    if (checkpass == false)
      return res
        .status(400)
        .send({ status: false, message: "Please enter currect password" });

    const admin = await Admin.findOne({
      email: req.body.email,
      password: adminEmail.password,
    });
    if (!admin)
      return res
        .status(400)
        .send({ status: false, message: "email or password are wrong" });
    console.log(admin.roles);

    const token = jwt.sign(
      {
        userId: admin._id.toString(),
        roles: admin.roles,
      },
      "ASSIGNMENT"
    );

    res.status(200).send({
      status: true,
      message: "admin Login Successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// admin get all account :-(access by primary admin and secondary admin  )

export const getAllAdmin = async (req, res) => {
  try {
    const userIdByToken = req.userId;

    if (!isValidObjectId(userIdByToken)) {
      return res
        .status(400)
        .send({ status: false, message: "token is not valid" });
    }

    const checkAdminroles = await Admin.findById(userIdByToken);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    const adminAccess = await Admin.find({ deleted: false });

    if (!adminAccess)
      return res.status(404).send({ status: false, message: "Data not found" });

    res.status(200).send({ status: true, data: adminAccess });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//getAccessById ,access by primary admin and particular token admin

export const getAdminById = async (req, res) => {
  try {
    const userIdByparams = req.params.adminId;

    const userIdByToken = req.userId;

    if (!isValidObjectId(userIdByparams))
      return res
        .status(400)
        .send({ status: false, message: "Admin id is not validate" });

    if (!isValidObjectId(userIdByToken)) {
      return res
        .status(400)
        .send({ status: false, message: "token is not valid" });
    }

    const checkAdminroles = await Admin.findById(userIdByToken);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    //authorization:-
    if (
      checkAdminroles.roles == "primary" ||
      userIdByparams === userIdByToken
    ) {
      const adminAccess = await Admin.findById(userIdByparams);

      if (!adminAccess)
        return res
          .status(404)
          .send({ status: false, message: "Data not found" });

      if (adminAccess.deleted == true)
        return res
          .status(404)
          .send({ status: false, message: "Data is already deleted" });

      res.status(200).send({ status: true, data: adminAccess });
    } else {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorize access" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//update admin by params :- (access by primary admin and particular token admin)

export const updateAdmin = async (req, res) => {
  try {
    const error = validationResult(req);
    //  console.log("error:",error);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const data = matchedData(req);

    const userIdByToken = req.userId;

    if (!isValidObjectId(userIdByToken))
      return res
        .status(400)
        .send({ status: false, message: "Token is not validate" });

    const checkAdminroles = await Admin.findById(data.adminId);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    //authorization:-
    if (checkAdminroles.roles == "primary" || data.adminId === userIdByToken) {
      const adminUpdate = await Admin.findOneAndUpdate(
        { _id: data.adminId, deleted: false },
        { $set: data },
        { new: true }
      );

      if (!adminUpdate)
        return res.status(404).send({
          status: false,
          message: "admin data is not found or already deleted",
        });

      res.status(200).send({
        status: true,
        message: "admin is updated successfully",
        data: adminUpdate,
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

//delete admin :-(access by primary admin and particular token admin )

export const deleteAdmin = async (req, res) => {
  try {
    const userIdByparams = req.params.adminId;

    const userIdByToken = req.userId;

    if (!isValidObjectId(userIdByparams))
      return res
        .status(400)
        .send({ status: false, message: "Admin id is not validate" });

    const checkAdminroles = await Admin.findById(userIdByToken);
    if (!checkAdminroles)
      return res
        .status(404)
        .send({ status: false, message: "Admin data not found" });

    //authorization:-
    if (
      checkAdminroles.roles == "primary" ||
      userIdByparams === userIdByToken
    ) {
      const adminUpdate = await Admin.findOneAndUpdate(
        { _id: userIdByparams },
        {
          deleted: true,
        },
        { new: true }
      );

      res
        .status(200)
        .send({ status: true, message: "admin is deleted", data: adminUpdate });
    } else {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorize access" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


//=================================== Admin forget Password :- ======================================//

const sendresetpasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp-mail.outlook.com",
      port: 587,
      secureConnection: false,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password", // Subject line
      text: "Hello world?", // plain text body
      html:
        "<p> Hi " +
        name +',Please copy thr Link <a href="http://localhost:5000/admin/reset-password?token='+token+'"> and reset your password </a>',
    };

    let a = await transporter.sendMail(mailOptions);

    console.log("a", a);

    return { status: true, message: 'success' };
  } catch (error) {
    return { status: false, message: error.message };
  }
};
//====== forget password with Link ========//
export const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const userData = await Admin.findOne({ email: email });
    console.log(userData.name, userData.email);

    if (userData) {
      const randomString = randomstring.generate();

      const data = await Admin.updateOne(
        { email: email },
        {
          $set: {
            token: randomString,
          },
        }
      );

      //console.log(randomString)
      let result = await sendresetpasswordMail(
        userData.name,
        userData.email,
        randomString
      );

      console.log("result", result);

      if (!result.status) {
        throw new Error(result.message);
      }

      res
        .status(200)
        .send({
          status: true,
          message: "Pease check your inbox mail and reset your password",
        });
    } else {
      res
        .status(200)
        .send({ status: true, message: "This email does not exist" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



//======================== Reset Pasword ================================//

export const resetPassword = async(req,res) =>{
  try{
    
    const token = req.query.token;
    const tokenData = await Admin.findOne({token:token})
   
    if(!tokenData){
      return res.status(400).send({status:false, message:"This link has been expire"})
     }

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    
    const userData =  await Admin.findByIdAndUpdate({_id:tokenData._id},{
      $set:{
        password:newPassword, token:""
      }
    },{new:true})

    res.status(200).send({status:true, message:"User Password has been Reset", data:userData})


  }catch(error){
    res.status(400).send({message:"This link has been expaired"})
  }
}


//forgetpassword with otp :-

export const sendOtpvarificationEmail = async(req,res) =>{
  try{
    const email = req.body.email;
    const userData = await Admin.findOne({ email: email });
  
    const otp = `${Math.floor(1000+ Math.random() * 9000)}`
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp-mail.outlook.com",
      port: 587,
      secureConnection: false,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password by otp", // Subject line
      text: "Hello world?", // plain text body
      html:
        `<p>Enter ${otp}  and verify your email address , this opt will expire in 10 minute only </a>`,
    };
  
    //hash the otp :-
    const saltRound = 10;
    const hashOTP = await bcrypt.hash(otp,saltRound);
    
    const newOtpVarification = await new UserOtpVarification({
         adminId:userData._id,
         otp:hashOTP,
         createdAt:Date.now(),
         expireAt : Date.now() + 600000,
    })
  
    await newOtpVarification.save();
  
    await transporter.sendMail(mailOptions);
    
    res.status(200).send({status:true, message:"varification OTP  mail is sent",data:email});

  }catch(error){
    return res.status(400).send({status:false, message:error.message})
  }
 
}

//============== OTP varification :- ==================//

export const verifyOTP = async (req, res) => {
  try {
    let { adminId, otp } = req.body;

    if (!adminId || !otp) {
      throw new Error("Please Enter otp or adminId")
    }
    const otpRecord = await UserOtpVarification.find({ adminId })

    if (otpRecord <= 0) {
      throw new Error("Account does not exist")
    }

    const { expireAt } = otpRecord[0];

    const hashedOTP = otpRecord[0].otp

    const validOTP = await bcrypt.compare(otp, hashedOTP)

    if (!validOTP) {
      res.status(400).send({ status: false, message: "Invalid code passes , check your Inbox" })
    }
    await UserOtpVarification.deleteMany({ adminId });

    res.status(200).send({ status: false, message: "User OTP is verified Successfully" });

  } catch (error) {
    return res.status(400).send({ status: false, message: error.message })
  }
  
}

//================ resend OTP ==========================//

export const resendOTP = async (req, res) => {
  try {
    
    const { adminId, email } = req.body;

    if (!adminId || !email) {
      throw new Error("Please Enter user details")
    }

    await UserOtpVarification.deleteMany({ adminId });

    sendOtpvarificationEmail(req,res)


  } catch (error) {
    return res.status(400).send({ status: false, message: error.message })
  }
}


//==================== mobile message otp send =======================//
var options = {
  authorization: "7FQIqncf9yMzUEbjsNDBGpT82u5COmkWJtxl416vAoSZaVdYieBr0u7SjYicv54aIsCJDZm21tXyEVNg",
  message: 'This is a test OTP message',
  numbers:['8617625143']
}
//send the message :-

fast2sms.sendMessage(options).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
})