import { Request, Response } from "express";
import pgConn from "../config/psDbConn";
import { getPool } from "../config/psDbConn";
import { UserAuthPayload } from "../types/customTypes";

const getTasks = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    const user = req.user as UserAuthPayload;
    const username = user.username;

    if (!username) {
        return res.status(401).json({ "message": "user object not provided" });
    }

    try {
        const pool = getPool(database);


        const tasks = await pool.query(`SELECT * FROM tasks WHERE createdby = '${username}'`);

        return res.status(200).json({ "tasks": tasks.rowCount === 0 ? "no tasks found. database is empty" : tasks.rows });
    } catch (error) {
        console.log('error occured while reading tasks:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

const getTasksByUsername = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    const user = req.user as UserAuthPayload;
    const username = user.username;

    if (!username) {
        return res.status(401).json({ "message": "username not provided." });
    }

    try {
        const pool = getPool(database);

        if (!user.roles.includes(5150)) {
            const tasks = await pool.query(`SELECT * FROM tasks WHERE createdby = '${username}'`);

            return res.status(200).json({ "tasks": tasks.rowCount === 0 ? "no tasks found. database is empty" : tasks.rows });
        }
        const tasks = await pool.query(`SELECT * FROM tasks WHERE createdby = '${req.params.username}'`);

        return res.status(200).json({ "tasks": tasks.rowCount === 0 ? "no tasks found by username. database is empty" : tasks.rows });
    } catch (error) {
        console.log('error occured while reading tasks by username:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

const getOneTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const foundOneTask = await pool.query(`SELECT * FROM tasks WHERE tasks.id = ${id}`);

        if (!foundOneTask.rows || foundOneTask.rows.length === 0) {
            return res.status(401).json({ "message": `task by id ${id} not found` });
        }

        return res.status(200).json(foundOneTask.rows[0])
    } catch (error) {
        console.log('error occured while reading one task', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

const createTask = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    const user = req.user as UserAuthPayload;
    const username = user.username;

    if (!username) {
        return res.status(401).json({ "message": "username not provided" });
    }

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ "message": "body of your request is empty" });
    }

    const { title, description, priority, status } = req.body;

    try {
        const pool = getPool(database);

        const newTask = await pool.query('INSERT INTO tasks (title, description, priority, status, createdby) VALUES ($1, $2, $3, $4, $5);', [title, description, priority, status, username]);

        return res.status(200).json({ "message": "new task created" });
    } catch (error) {
        console.log('error occured while reading tasks by username:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

const updateTaskById = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    const user = req.user as UserAuthPayload;
    const username = user.username;

    if (!username) {
        return res.status(401).json({ "message": "username not provided" });
    }

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ "message": "body of your request is empty" });
    }

    const { id, title, description, priority, status } = req.body;

    try {
        const pool = getPool(database);

        const editedTask = await pool.query('UPDATE tasks SET title = ($1), description = ($2), priority = ($3), status = ($4) WHERE id = ($5) AND createdby = ($6) RETURNING *;', [title, description, priority, status, id, username]);

        if (editedTask.rowCount === 0) {
            return res.status(404).json({ "message": "You do not have such task in the database" });
        }

        return res.status(200).json({ "UPDATED TASK": editedTask.rows[0] });

    } catch (error) {
        console.log('error occured while updating task by id:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

const deleteTaskById = async (req: Request, res: Response) => {
    const database = process.env.PG_TASKS_DB as string;
    await pgConn(database);

    const user = req.user as UserAuthPayload;
    const username = user.username;

    if (!username) {
        return res.status(401).json({ "message": "username not provided" });
    }

    if (!req.body?.id) {
        return res.status(400).json({ "message": "no ID provided for further task delition" });
    }

    const { id } = req.body;

    try {
        const pool = getPool(database);

        const foundTask = await pool.query('SELECT * FROM tasks WHERE id = ($1);', [id]);

        if (foundTask.rowCount === 0) {
            return res.status(404).json({ "message": `task not found the id ${id}` });
        }

        const taskToDelete = await pool.query('DELETE FROM tasks where id = ($1);', [id]);
        console.log(taskToDelete)
        console.log(taskToDelete.rowCount);
        console.log(taskToDelete.rows)

        return res.status(200).json({ "message": "just a response" });
    } catch (error) {
        console.log('error occured while task deletion:', error);
        return res.status(500).json({ "message": "Something went wrong" });
    }
}

export {
    getTasks,
    getOneTaskById,
    getTasksByUsername,
    createTask,
    updateTaskById,
    deleteTaskById
}