import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";

import attendance from "./routes/attendance.js";
import user from "./routes/user.js";

const { ATLAS_URI, PORT, ORIGIN } = process.env;
const app = express();

mongoose
    .connect(ATLAS_URI)
    .then(() => console.log("MongoDB is  connected successfully"))
    .catch((err) => console.error(err));

app.use(
    cors({
        origin: ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/attendance", attendance);
app.use("/user", user);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});