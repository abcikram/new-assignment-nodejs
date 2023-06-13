import mongoose from "mongoose";

const UserOtpVarificationSchema = new mongoose.Schema(
    {
        adminId: String,
        otp: String,
        createdAt: Date,
        expireAt: Date,
    }, {
    timestamps: true,
}
)

const UserOtpVarification = mongoose.model("otp", UserOtpVarificationSchema)

export default UserOtpVarification;