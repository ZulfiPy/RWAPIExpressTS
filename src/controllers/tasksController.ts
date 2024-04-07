import { Request, Response } from "express";
import Task from "../model/Task";
import dbConn from "../config/dbConn";

const getTasks = async (req: Request, res: Response) => {
    await dbConn();

    try {
        const tasks = await Task.find();

        if (tasks.length < 1) {
            return res.status(404).json({ "message": "Tasks database is empty." });
        }

        return res.status(200).json({ "message": tasks });
    } catch (error) {
        console.log(`error occured while reading tasks: ${error}`);
        return res.status(500).json({ "message": 'internal server error' });
    }
}

export {
    getTasks
}