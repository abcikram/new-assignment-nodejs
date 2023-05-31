import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["new", "contacted"],
        default: "new"
    },
    note: {
        type: String
    },
}, { timestamps: true });

const Contact = mongoose.model('Contactus', contactUsSchema);

export default Contact;
