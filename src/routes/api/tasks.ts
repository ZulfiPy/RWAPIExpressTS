import express from "express";
import { getTasks, getOneTaskById, getTasksByUsername, createTask } from "../../controllers/tasksController";
import { isAuthorized } from "../../middleware/isAuthorized";

const router = express.Router();

// /api/tasks route protected with custom isAuthorized function 
router.get('/', isAuthorized([2001]), getTasks);
router.get('/:username', isAuthorized([2001]), getTasksByUsername);
router.get('/:username/:id', isAuthorized([2001]), getOneTaskById);
router.post('/', isAuthorized([2001]), createTask)

export default router;