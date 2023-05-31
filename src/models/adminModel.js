import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            reaquired: true,
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
    }, {
    timestamps: true
  },
)

const Admin = mongoose.model("Admin", adminSchema)

export default Admin