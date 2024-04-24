import express from "express";
import { getTasks, getTasksByUsername } from "../../controllers/tasksController";
import { isAuthorized } from "../../middleware/isAuthorized";

const router = express.Router();

// /api/tasks route protected with custom isAuthorized function 
router.get('', isAuthorized([2001]), getTasks);
router.get('/:username', isAuthorized([2001]), getTasksByUsername);

export default router;