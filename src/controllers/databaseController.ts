import { Request, Response } from "express";
import connectDB from "../config/connectDB";

const connectToDB = async (req: Request, res: Response) => {
    const dbConnection = await connectDB();

    return res.json({ "databaseConnection": dbConnection });
}

module.exports = {
    connectToDB,
}