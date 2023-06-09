import Course from "../models/courseModel.js";
import Admin from "../models/adminModel.js";
import { isValid, isValidId} from '../validator/validator.js';
import { Result,matchedData,validationResult } from 'express-validator';



export const addCourse = async (req, res) => {
    try {

        const userIdByToken = req.userId;

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-(only primary admin add course)
        if (checkAdminroles.roles == 'primary') {


            const error = validationResult(req);
             //  console.log("error:",error);
            if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg});
            }
           
            const createCourse = await Course.create(req.body)

            res.status(201).send({ status: true, message: "course is added successfully", data: createCourse })


        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }

        
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
  
}

//getcourse :-

export const getcourse = async (req, res) => {
    try {
        const { title,sort, instructor, category } = req.query;
        
        const filter = {};

        if (title) {
            filter.title = { $regex: title, $options: "i" };   // $options:"i" means insansitibe 
            // $regex Provides regular expression capabilities for pattern matching strings in queries
        }

            if (instructor) {
                filter.instructor = { $regex: instructor, $options: "i" };
            }

            if (category) {
                if (!["science", "technology", "business", "arts"].includes(category)) {
                    return res.status(400).send({
                        status: false, message: "category must be science,technology,business,arts"
                    })
                }
                filter.category = category

            }
           
        //------ course sort by parameters:- -----//
        let apiData = Course.find(filter);

        if (sort) {
            let sortFix = sort.replace(",", " ")
            apiData = apiData.sort(sortFix)
        }

        //---------- course pagination ------------//
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 3;

        let skip = (page - 1) * limit;

        apiData = apiData.skip(skip).limit(limit)
        
            const coursefind = await apiData;

            if (coursefind.length == 0) {
                return res.status(404).send({ status: false, message: "No Course found" });
            }

            res.status(200).send({ status: true, data: coursefind })
        }

      catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
   
}

//getcourseById:-

export const getcourseById = async (req, res) => {
    try {

        const courseId = req.params.courseId;
        if (!isValidId(courseId)) return res.status(400).send({ status: false, message: "course id is not validate" })

        const coursefind = await Course.findById(courseId);

        if (!coursefind) return res.status(404).send({ status: false, message: "course data is not found" })

        res.status(200).send({ status: true, data: coursefind })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

// update course :-

export const updateCourse = async (req, res) => {
    try {
        const { title, description, mrp, price, syllabus, duration, instructor, category } = req.body;
        
        const courseId = req.params.courseId;
        
        if (!isValidId(courseId)) return res.status(400).send({ status: false, message: "course id is not validate" })
        
        const userIdByToken = req.userId;

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-(only primary admin can update the course)
        if (checkAdminroles.roles == 'primary') {

            if (mrp) {
                if (!Number(mrp)) {
                    return res.status(400).send({ status: false, message: "mrp must be a number" });
                }
                if (mrp < 0) {
                    return res.status(400).send({ status: false, message: "mrp not be less than zero" })
                }
            }
         

            if (price) { 
                if (!Number(price)) {
                    return res.status(400).send({ status: false, message: "mrp must be a number" });
                }
                if (price < 0) {
                    return res.status(400).send({ status: false, message: "price not be less than zero" })
                }
            } 
            
            if (duration) {
                if (!Number(duration)) {
                    return res.status(400).send({ status: false, message: "mrp must be a number" });
                }
                if (duration < 0) {
                    return res.status(400).send({ status: false, message: "course duration not be less than zero" })
                }
            }


            if (category) {
                if (!["science", "technology", "business", "arts"].includes(category))
                    return res.status(400).send({ status: false, message: "category must be science,technology,business,arts" })
            }
            

            const updateCourse = await Course.findOneAndUpdate({ _id: courseId }, {
                $set: {
                    title, description, mrp, price, syllabus, duration, instructor, category
                }
            },{new:true})

            res.status(200).send({ status: true, message: "course is updated successfully", data: updateCourse })


        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


//delete-Course :-

export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        if (!isValidId(courseId)) return res.status(400).send({ status: false, message: "course id is not validate" })

        const userIdByToken = req.userId;

        const checkAdminroles = await Admin.findById(userIdByToken)
        if (!checkAdminroles) return res.status(404).send({ status: false, message: "Admin data not found" })

        //authorization:-(only primary admin can delete course)
        if (checkAdminroles.roles == 'primary') {

            const courseDelete = await Course.deleteOne({ _id: courseId })

            res.status(200).send({ status: true, message: "The course is delete successfully"})

        } else {
            return res.status(403).send({ status: false, message: "Unauthorize access" })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


