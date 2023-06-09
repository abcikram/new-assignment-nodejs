import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { Result,matchedData, validationResult } from 'express-validator';



//Admin register:-

export const createAdmin = async (req, res) => {
    try {
        //today I learn:-
        const error = validationResult(req);
      //  console.log("error:",error);
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg});
        }

        const data = matchedData(req);
        //console.log(data)

        //encripted password:-
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(data.password, salt)
        req.body.password = newPassword;
        
        const admin = await Admin.create(req.body)

      return res.status(201).json({ status: true, message: 'admin is created', data: admin })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }

}


//Admin login:-

export const loginAdmin = async (req, res) => {
    try {
        const error = validationResult(req);
        //  console.log("error:",error);
          if (!error.isEmpty()) {
             return res.status(400).json({ errors: error.array()[0].msg});
          }

        // check email for admin
        let adminEmail = await Admin.findOne({ email: req.body.email });
        if (!adminEmail) return res.status(400).send({ status: false, message: "Email is not correct, Please provide valid email" });
        
        
        const checkpass = await bcrypt.compare(req.body.password, adminEmail.password);
        console.log(checkpass);

        if (checkpass == false) return res.status(400).send({ status: false, message: "Please enter currect password" })

        const admin = await Admin.findOne({ email: req.body.email, password: adminEmail.password })
        if (!admin) return res.status(400).send({ status: false, message: "email or password are wrong" })
        console.log(admin.roles)

        const token = jwt.sign({
            userId: admin._id.toString(),
        },
            "ASSIGNMENT"
        )

        res.status(200).send({ status: true, message: 'admin Login Successfully', token: token })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


// admin get all account :-(access by primary admin and secondary admin  )

export const getAllAdmin = async (req, res) => {
    try {
        const userIdByToken = req.userId;

        if(!isValidObjectId(userIdByToken)){
            return res.status(400).send({status:false,message:"token is not valid"})
        }

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })
      
        const adminAccess = await Admin.find({deleted:false});

        if(!adminAccess) return res.status(404).send({status:false,message:"Data not found"})
        
        res.status(200).send({status:true,data:adminAccess})

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

//getAccessById ,access by primary admin and particular token admin 

export const getAdminById = async (req, res) => {
    try {
          
        const userIdByparams = req.params.adminId;

        const userIdByToken = req.userId;
        
        if (!isValidObjectId(userIdByparams)) return res.status(400).send({ status: false, message: "Admin id is not validate"})
        
        if(!isValidObjectId(userIdByToken)){
            return res.status(400).send({status:false,message:"token is not valid"})
        }

        const checkAdminroles = await Admin.findById(userIdByToken)
        if(!checkAdminroles) return res.status(404).send({status:false,message:"Admin data not found"})
     
        //authorization:-
        if (checkAdminroles.roles == 'primary' || (userIdByparams === userIdByToken)) {

            const adminAccess = await Admin.findById(userIdByparams);

            if (!adminAccess) return res.status(404).send({ status: false, message: "Data not found" })

            if (adminAccess.deleted == true) return res.status(404).send({ status: false, message: "Data is already deleted"})

            res.status(200).send({ status: true, data: adminAccess })
        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }  

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

//update admin by params :- (access by primary admin and particular token admin) 

export const updateAdmin = async (req, res) => {
    try {
          const error = validationResult(req);
          //  console.log("error:",error);
          if (!error.isEmpty()) {
             return res.status(400).json({ errors: error.array()[0].msg});
          }
  
        const data = matchedData(req);

        const userIdByparams = req.params.adminId;
       
        const userIdByToken = req.userId;

        if (!isValidObjectId(userIdByparams)) return res.status(400).send({ status: false, message: "Admin id is not validate" })
        if(!isValidObjectId(userIdByToken))  return res.status(400).send({ status: false, message: "Token is not validate" })

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-
        if (checkAdminroles.roles == 'primary' || (userIdByparams === userIdByToken)) {

            const adminUpdate = await Admin.findOneAndUpdate({ _id: userIdByparams ,deleted:false},
                { $set: data },
                { new: true },
            );

            res.status(200).send({ status: true, message: "admin is updated successfully", data: adminUpdate });

        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

//delete admin :-(access by primary admin and particular token admin )

export const deleteAdmin = async (req, res) => {
    try {

        const userIdByparams = req.params.adminId;

        const userIdByToken = req.userId;

        if (!isValidObjectId(userIdByparams)) return res.status(400).send({ status: false, message: "Admin id is not validate" })

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-
        if (checkAdminroles.roles == 'primary' || (userIdByparams === userIdByToken)) {

            const adminUpdate = await Admin.findOneAndUpdate({ _id: userIdByparams },{
             deleted:true    
            },{new:true});

            res.status(200).send({ status: true, message: "admin is deleted",data:adminUpdate});

        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


