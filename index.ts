import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import dbConn from "./src/config/dbConn";

import databaseRouter from "./src/routes/database";
import tasksRouter from "./src/routes/api/tasks";


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// test database connection
app.use('/database', databaseRouter);

// tasks router GET / POST / PUT / DELETE
app.use('/api/tasks', tasksRouter);

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    await dbConn();
});