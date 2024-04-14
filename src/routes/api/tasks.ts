import express from "express";
import { getTasks } from "../../controllers/tasksController";
import { isAuthorized } from "../../middleware/isAuthorized"; 

const router = express.Router();

// /api/tasks route protected with custom isAuthorized function 
router.route('/')
    .get(isAuthorized([2001]), getTasks);

export default router;