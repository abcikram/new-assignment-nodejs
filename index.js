import express from "express";
import adminRouter from './src/routes/adminRouter.js';
import courseRouter from './src/routes/courseRouter.js';
import contactRouter from './src/routes/contactRouter.js'
import Colors from 'colors'
import dotenv from 'dotenv'
import './src/mongodb/db.js';

const app = express();

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use('/admin',adminRouter);
app.use('/course',courseRouter);
app.use('/contact',contactRouter);

app.listen(process.env.PORT, () => {
    console.log("Server running on PORT 5000".blue.underline)
})
