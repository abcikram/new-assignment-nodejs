import mongoose from "mongoose";


mongoose.connect(`mongodb+srv://Bikram:IZWPEHXAVqidNYde@cluster0.jvtn9n6.mongodb.net/assignment-85`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>console.log("MongoDB is connected".yellow)).catch((error) => console.log(error.red))





