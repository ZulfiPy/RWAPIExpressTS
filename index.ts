import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import dbConn from "./src/config/dbConn";

import tasksRouter from "./src/routes/api/tasks";
import registerRouter from "./src/routes/register";
import authRouter from "./src/routes/auth";

import cors from "cors";
import { corsOptions } from "./src/config/corsOptions";

import passport from "passport";
import { initPassport } from "./src/middleware/passport.mw";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// initialize passport
initPassport(app);

// CORS - Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// built-in middleware for json
app.use(express.json())

// routes
app.use('/register', registerRouter);
app.use('/auth', authRouter);

// API routes protected with passport.js authentication and isAuthorized custom middleware
app.use('/api/tasks', passport.authenticate('jwt', { session: false }), tasksRouter);

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    await dbConn();
});