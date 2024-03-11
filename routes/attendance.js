import express from "express";
import userVerification from '../middlewares/AuthMiddleware.js';
import {GetList, PunchInOut} from "../controllers/AttendanceController.js";


const router = express.Router();

router.get("/", userVerification, GetList);

router.post("/", userVerification, PunchInOut);

export default router;