import mongoose from "mongoose";

export const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
}


export const isValidPassword = function (password) {
    return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password))
}

export const isVAlidEmail = function (email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)
}


export const isValidPhone = function (phone) {
    return (/^[6789]\d{9}$/).test(phone)
}


export const isValidName = function (name) {
    return (/^[a-zA-Z]+$/).test(name)

}

export const isValidId = function (Id) {
    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return false
    }
    return (true)
}

export const isValidPrice = function (price) {
    return /^[0-9.]+$/.test(price); 
};