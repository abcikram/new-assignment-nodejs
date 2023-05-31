import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        unique:true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    syllabus: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    instructor: {
      type: String,
      required: true
    },
    category: {
        type: String,
        enum: ["science","technology","business","arts"],
        required: true
    },
},{timestamps:true});

const Course = mongoose.model('Course', courseSchema);

export default Course;
