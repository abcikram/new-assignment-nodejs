import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';


export const authentication = function (req, res, next) {
        try {
            const token = req.headers["authorization"];
       
            if (!token) {
                return res.status(401).send({ status: false, message: "token must be present" });
            }

            let splitToken = token.split(" ");

            // token validation.
            if (!token) {
                return res.status(400).send({ status: false, message: "token must be present" });
            }
          
            else {
                jwt.verify(splitToken[1], "ASSIGNMENT", function (err, data) {
                    if (err) {
                        return res.status(400).send({ status: false, message: err.message });
                    } else {
                        req.userId = data.userId;
                        let adminExists = Admin.findOne({_id:req.userId,deleted:false})
                        if(adminExists) {
                            next();
                        }
                        else if(!adminExists){
                            return res.send({message:"user data is already deleted"})
                        }
                    }
                });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    };

    