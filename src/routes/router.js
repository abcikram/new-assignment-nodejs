import express from "express";
const router = express.Router();

import { createAdmin, loginAdmin, getAllAdmin,getAdminById ,updateAdmin,deleteAdmin} from '../Controller/adminController.js';
import { addCourse, deleteCourse, getcourse,getcourseById, updateCourse } from '../Controller/courseController.js';
import {addContact,updateUserByAdmin,deleteByAdmin,getmessage,getmessageById} from '../Controller/contactUsController.js'
    
import { authentication } from "../middleware/auth.js";

//------------------- admin api ----------------------------//

router.post('/admin/register', createAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/alladmin',authentication,getAllAdmin)
router.get('/admin/getadmin/:adminId',authentication,getAdminById)
router.put('/admin/update/:adminId', authentication, updateAdmin)
router.delete('/admin/delete/:adminId', authentication, deleteAdmin)


//-------------------- course api --------------------------//

router.post('/course/add', authentication, addCourse);
router.get('/course/find', getcourse)
router.get('/course/find/:courseId', getcourseById)
router.put('/course/update/:courseId',authentication,updateCourse)
router.delete('/course/delete/:courseId', authentication, deleteCourse)


//--------------------- contact us -------------------------//

router.post('/contact/add',addContact);
router.get('/contact/message',authentication,getmessage)
router.get('/contact/message/:contactId',authentication, getmessageById)
router.patch('/contact/update/:contactId', authentication, updateUserByAdmin)
router.delete('/contact/delete/:contactId', authentication, deleteByAdmin)


export default router