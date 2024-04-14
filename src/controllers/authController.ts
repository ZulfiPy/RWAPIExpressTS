import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../model/User";

const signIn = async (req: Request, res: Response) => {
    if (!req.body || Object.keys(req.body).length < 1) {
        return res.status(400).json({ "message": "empty body of the request" });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ "message": "user not found" });
        }

        const match = await bcrypt.compare(password, user.password as string);

        if (!match) {
            return res.status(401).json({ "message": "wrong password" });
        }

        const token = jwt.sign(
            {
                "UserInfo": {
                    username,
                    roles: Object.values(user.roles).filter(Boolean)
                }
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        // refresh token logic...
        
        return res.status(200).json({ "jwt": token });
    } catch (error) {
        console.log('error occured while authentication', error);
        return res.status(500).json({ "message": "internal server error" });
    }
}

export {
    signIn,
}