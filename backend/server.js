import cors from "cors";
import express from "express"
import appRoutes from "./app.js"
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '10kb' }))
const corsOrigin = (process.env.CORS_ORIGIN || "http://localhost:5173").replace(/\/+$/, "");
app.use(cors({ origin: corsOrigin }));

app.use("/api",appRoutes)

app.listen(port ,() =>{
    console.log("jookseb")
})