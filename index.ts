import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import dbConn from "./src/config/dbConn";

import databaseRouter from "./src/routes/database";
import tasksRouter from "./src/routes/api/tasks";
import registerRouter from "./src/routes/register";
import cors from "cors";

import { corsOptions } from "./src/config/corsOptions";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// CORS - Cross-Origin Resource Sharing
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// built-in middleware for json
app.use(express.json())

// test database connection
app.use('/database', databaseRouter);

// user register router
app.use('/register', registerRouter);

// tasks router GET / POST / PUT / DELETE
app.use('/api/tasks', tasksRouter);

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    await dbConn();
});