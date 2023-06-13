import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique:true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required:true
        },
        roles: {
            type: String,
            enum: ["primary", "secondary"],
            required:true,
        },
        deleted:{
            type:Boolean,
            default:false,
        },
        token:{
            type:String,
            default:''
        },
    }, {
    timestamps: true
  },
)

const Admin = mongoose.model("Admin", adminSchema)

export default Admin