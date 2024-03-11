import express from "express";
import {Login, Signup} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/", Login);
router.put("/", Signup);

export default router;