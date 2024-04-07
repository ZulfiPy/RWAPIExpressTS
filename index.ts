import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/connectDB";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// test database connection
app.use('/database', require('./src/routes/database'));

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    await connectDB();
});