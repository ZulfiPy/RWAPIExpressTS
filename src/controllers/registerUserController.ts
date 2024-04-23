import { Request, Response } from "express";
import dbConn from "../config/dbConn";
import User from "../model/User";

const registerUser = async (req: Request, res: Response) => {
    if (!req?.body || Object.keys(req?.body).length < 1) return res.status(400).json({ "message": "No data provided for further registration" });

    await dbConn();

    const { firstName, lastName, email, isikukood, birthDate, username, password } = req.body;

    try {
        const newUser = await User.create({ firstName, lastName, email, isikukood, birthDate, username, password });

        console.log(newUser);
        return res.status(201).json({ "message": "user have been registered" });
    } catch (error) {
        console.log('error occurred while registering new user', error);
        return res.status(500).json({ "message": "internal server error" });
    }
}

export {
    registerUser
}