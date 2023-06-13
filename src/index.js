import express from "express";
import adminRouter from './routes/adminRouter.js';
import courseRouter from './routes/courseRouter.js';
import contactRouter from './routes/contactRouter.js'
import '../src/mongodb/db.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use('/admin',adminRouter);
app.use('/course',courseRouter);
app.use('/contact',contactRouter);

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on PORT 5000")
})
