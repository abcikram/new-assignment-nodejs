import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {isVAlidEmail,isValidName,isValidPassword,isValidPhone,isValid,isValidId} from '../validator/validator.js'



//Admin register:-

export const createAdmin = async (req, res) => {
    try {
        const { name, phone, email, password,roles } = req.body;


        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Field can't be empty" });
        
        if (!name) return res.status(400).send({ status: false, message: "Admin name is required" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Name miust be alphabetical order" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone number is required" })

        // validation for phone number:-
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Enter valid number, number must in ten digit" })

        //  db call for checking duplicate number exists :-
        const phones = await Admin.findOne({ phone: phone })
        if (phones) return res.status(400).send({ status: false, message: "Phone number is already exists" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })

        // validation for email:-
        if (!isVAlidEmail(email)) return res.status(400).send({ status: false, message: "Please provide the valid email address" })


        //  db call for checking duplicate email exists:-
        const checkEmail = await Admin.findOne({ email: email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "admin email is already exist" });
        }


        if (!password) {
            return res.status(400).send({ status: false, message: "Please provide password" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({
                staus: false,message: "Length of the password must be between 8 to 15 characters , atleast use one Uppercase"
            });
        }

        //encripted password:-
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt)
        req.body.password = newPassword;


        if (!roles) {
            return res.status(400).send({ status: false, message: "Please provide roles" });
        }
        if (!["primary", "secondary"].includes(roles))
            return res.status(400).send({ status: false, message: "roles must be  primary or secondary" })
        
        const admin = await Admin.create(req.body)
       // console.log(admin)

        res.status(201).send({ status: true, message: 'admin is created', data: admin })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


//Admin login:-

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Field can't be empty" });


        if (!(email)) {
            return res.status(400).send({ status: false, message: "Email is required!!" })
        }

        // check email for admin
        let adminEmail = await Admin.findOne({ email: email });
        if (!adminEmail) return res.status(400).send({ status: false, message: "Email is not correct, Please provide valid email" });

        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        const checkpass = await bcrypt.compare(password, adminEmail.password);

        if (checkpass == false) return res.status(400).send({ status: false, message: "Please enter currect password" })

        const admin = await Admin.findOne({ email: email, password: adminEmail.password })
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

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })
      
        const adminAccess = await Admin.find({});

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
        
        if (!isValidId(userIdByparams)) return res.status(400).send({ status: false, message: "Admin id is not validate"})
        const checkAdminroles = await Admin.findById(userIdByToken)
        if(!checkAdminroles) return res.status(404).send({status:false,message:"Admin data not found"})
     
        //authorization:-
        if (checkAdminroles.roles == 'primary' || (userIdByparams === userIdByToken)) {

            const adminAccess = await Admin.findById(userIdByparams);

            if (!adminAccess) return res.status(404).send({ status: false, message: "Data not found" })

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
        const { name, phone, email, password, roles } = req.body;

        if (name) { if (!isValidName(name)) return res.status(400).send({ status: false, message: "Name miust be alphabetical order" }); }
        
        if (phone) { if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Enter valid number, number must in ten digit" }) }
        
        // validation for email:-
        if (email) {
            if (!isVAlidEmail(email)) return res.status(400).send({ status: false, message: "Please provide the valid email address" })
        }
      
        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).send({
                    staus: false, message: "Length of the password must be between 8 to 15 characters , atleast use one Uppercase"
                });
            } }
        
       
        if (roles) {
            if (!["primary", "secondary"].includes(roles))
                return res.status(400).send({ status: false, message: "roles must be  primary or secondary" })
          }
       

        const userIdByparams = req.params.adminId;
        
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty , please enter some data" })
        } 
       
        const userIdByToken = req.userId;

        if (!isValidId(userIdByparams)) return res.status(400).send({ status: false, message: "Admin id is not validate" })
        
        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-
        if (checkAdminroles.roles == 'primary' || (userIdByparams === userIdByToken)) {

            const adminUpdate = await Admin.findOneAndUpdate({ _id: userIdByparams },
                { $set: { name ,email,phone,password,roles} },
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

        if (!isValidId(userIdByparams)) return res.status(400).send({ status: false, message: "Admin id is not validate" })

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-
        if (checkAdminroles.roles == 'primary' || (userIdByparams === userIdByToken)) {

            const adminUpdate = await Admin.deleteOne({ _id: userIdByparams });

            res.status(200).send({ status: true, message: "admin is deleted"});

        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


