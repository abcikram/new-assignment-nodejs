import express from "express";
import router from "./routes/router.js";
import '../src/mongodb/db.js'


const app = express();

app.use(express.json());


app.use('/', router)

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on PORT 5000")
})
