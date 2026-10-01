import cors from "cors";
import express from "express"
import appRoutes from "./app.js"

const app = express();
const port = 8080;

app.use(express.json({ limit: '10kb' }))
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

app.use("/api",appRoutes)

app.listen(port ,() =>{
    console.log("jookseb")
})