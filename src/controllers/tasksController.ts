import { Request, Response } from "express";
import pgConn from "../config/psDbConn";
import { getPool } from "../config/psDbConn";

const getTasks = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const tasks = await pool.query('SELECT * FROM tasks');

        if (tasks.rowCount === 0) {
            return res.status(404).json({ "message": "no tasks found. database is empty." });
        }

        return res.status(200).json({ "message": tasks.rows });
    } catch (error) {
        console.log('error occured while reading tasks:', error);
        return res.sendStatus(500);
    }
}


export {
    getTasks,
}