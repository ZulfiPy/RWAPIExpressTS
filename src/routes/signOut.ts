import express from "express";
import { signOut } from "../controllers/logoutController";

const router = express.Router();

router.get('/', signOut);

export default router;