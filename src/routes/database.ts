import express from "express";
import { connectToDB } from "../controllers/databaseController";

const router = express.Router();

router.route('/')
    .get(connectToDB)

export default router;