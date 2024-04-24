import { Request, Response } from "express";
import pgConn from "../config/psDbConn";
import { getPool } from "../config/psDbConn";
import { UserAuthPayload } from "../types/customTypes";

const getTasks = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const tasks = await pool.query('SELECT * FROM tasks');

        if (tasks.rowCount === 0) {
            return res.status(404).json({ "message": "no tasks found. database is empty." });
        }

        return res.status(200).json({ "tasks": tasks.rows });
    } catch (error) {
        console.log('error occured while reading tasks:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

const getTasksByUsername = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    if (!req.user) {
        return res.status(401).json({ "message": "user object not provided." });
    }

    const user = req.user as UserAuthPayload;
    const username = user.username;

    if (!username) {
        return res.status(400).json({ "message": "username not provided." });
    }

    try {
        const pool = getPool(database);

        if (!user.roles.includes(5150)) {
            const tasks = await pool.query(`SELECT * FROM tasks WHERE createdby = '${username}'`);

            return res.status(200).json({ "tasks": tasks.rows });
        }
        const tasks = await pool.query(`SELECT * FROM tasks WHERE createdby = '${req.params.username}'`);

        return res.status(200).json({ "tasks": tasks.rows });
    } catch (error) {
        console.log('error occured while reading tasks by username:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}


export {
    getTasks,
    getTasksByUsername,
}