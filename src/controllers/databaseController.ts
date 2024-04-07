import { Request, Response } from "express";
import dbConn from "../config/dbConn";

const connectToDB = async (req: Request, res: Response) => {
    const dbConnection = await dbConn();

    return res.json({ "databaseConnection": dbConnection });
}

export {
    connectToDB,
}