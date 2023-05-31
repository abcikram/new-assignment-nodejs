import Contact from "../models/contactUsModel.js";
import Admin from "../models/adminModel.js";
import { isVAlidEmail, isValidName, isValidPhone, isValid, isValidId } from '../validator/validator.js'


//addContactUsdata :-

export const addContact = async (req, res) => {
    try {
        const { name, email, mobileNumber, message } = req.body;
        
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Field can't be empty" });

        if (!isValid(name)) return res.status(400).send({ status: false, message: "user name is required" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Name miust be alphabetical order" })
        
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })

        // validation for email:-
        if (!isVAlidEmail(email)) return res.status(400).send({ status: false, message: "Please provide the valid email address" })
        
        if (!isValid(mobileNumber)) return res.status(400).send({ status: false, message: "Phone number is required" })

        // validation for phone number:-
        if (!isValidPhone(mobileNumber)) {
            return res.status(400).send({ status: false, message: "Enter valid number, number must in ten digit,start with 6,7,8,9" }) 
        }
            
        if (!message) return res.status(400).send({ status: false, message: "message is required" })

        const createUser = await Contact.create(req.body)

        res.status(201).send({ status: true, message: "Contact is added successfully", data: createUser })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
    
}


// getContact :-
export const getmessage = async (req, res) => {
    try {
        const { name , status ,sort} = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: "i" };   // $options:"i" means insansitibe 
            // $regex Provides regular expression capabilities for pattern matching strings in queries
        }

        if (status) {
            if (!["new", "contacted"].includes(status)) {
                return res.status(400).send({
                    status: false, message: "status must be new or contacted"
                })
            }
            filter.status = status

        }

        //------ course sort by parameters:- -----//
        let apiData = Contact.find(filter);

        if (sort) {
            let sortFix = sort.replace(",", " ")
            apiData = apiData.sort(sortFix)
        }

        //---------- course pagination ------------//
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;

        let skip = (page - 1) * limit;

        apiData = apiData.skip(skip).limit(limit)
       
        //call 
        const userfind = await apiData;

        if (userfind.length == 0) {
            return res.status(404).send({ status: false, message: "No User found" });
        }

        res.status(200).send({ status: true, data: userfind })
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}
 
//getmessageById:-
export const getmessageById = async (req, res) => {
    try {

        const contactId = req.params.contactId;
        if (!isValidId(contactId)) return res.status(400).send({ status: false, message: "course id is not validate" })

        if (!isValidId(contactId)) {
            return res.status(400).send({ status: false, message: "contactid is not validate" })
        }

        const contactfind = await Contact.findById(contactId);

        if (!contactfind) return res.status(404).send({ status: false, message: "contact data is not found" })

        res.status(200).send({ status: true, data: contactfind })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}



// update user status:-

export const updateUserByAdmin = async (req, res) => {
    try {
        const userIdByparams = req.params.contactId;

        const tokenId = req.userId;

        const { status, note } = req.body;
        
        if (!isValidId(userIdByparams))
        {
            return res.status(400).send({ status: false, message: "Userid is not validate" })
        }
        const checkAdminroles = await Admin.findById(tokenId)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })
          
        if (status) {
            if (!["new", "contacted"].includes(status)) {
                return res.status(400).send({ status: false, message: "status must be new or contacted"})
            }
        }

        const finduser = await Contact.findById(userIdByparams)
        console.log(finduser.status)
        if (finduser.status == 'contacted') return res.send({message:"user is already connected"})

        //authorization:-
        if (checkAdminroles.roles == 'primary') {
            //update the status and notes :-
                const updatedMessage = await Contact.findByIdAndUpdate(
                    userIdByparams,
                    {
                        $set:
                            { status, note },
                    },
                    { new: true }
                );


                res.status(200).send({ status: true, data: updatedMessage })
            

        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
         }

       
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};

//delete Contactus :-

export const deleteByAdmin = async (req, res) => {
    try {
        const userIdByparams = req.params.contactId;

        const tokenId = req.userId;


        if (!isValidId(userIdByparams)) {
            return res.status(400).send({ status: false, message: "Userid is not validate" })
        }

        const checkAdminroles = await Admin.findById(tokenId)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-
        if (checkAdminroles.roles == 'primary') {
            const deleteMessage = await Contact.findByIdAndDelete(
                userIdByparams
            );

            res.status(200).send({status:true,message:"contact is deleted"});
        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};

