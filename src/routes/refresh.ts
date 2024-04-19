import express from "express";
import { refreshTokens } from "../controllers/refreshController";

const router = express.Router();

router.get('/', refreshTokens)

export default router;