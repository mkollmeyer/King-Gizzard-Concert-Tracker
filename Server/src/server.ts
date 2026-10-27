import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.ts"
import loginRouter from "./routes/login.ts"
import setlistRouter from "./routes/setlist.ts"

dotenv.config();

const app = express();
connectDB();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use("/api", loginRouter);
app.use("/api", setlistRouter);

app.get("/", async(req, res) => {
    res.send(`Hello World!`);
})

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});