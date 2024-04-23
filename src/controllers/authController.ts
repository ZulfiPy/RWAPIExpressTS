import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConn from "../config/dbConn";

import User from "../model/User";

const signIn = async (req: Request, res: Response) => {
    if (!req.body || Object.keys(req.body).length < 1) {
        return res.status(400).json({ "message": "empty body of the request" });
    }

    await dbConn();
    
    const { username, password } = req.body;
    const cookies = req?.cookies;
    console.log('cookies here', JSON.stringify(cookies?.jwt));

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
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h" }
    );

    // refresh token logic...
    const refreshToken = jwt.sign(
        { username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "4h" }
    );

    let refreshTokensArray =
        !cookies?.jwt
            ? user.refreshTokensArray
            : user.refreshTokensArray.filter(token => token !== cookies.jwt);

    if (cookies?.jwt) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    }

    user.refreshTokensArray = [...refreshTokensArray, refreshToken];
    const result = await user.save();
    console.log(result);

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json({ "jwt": token });
}

export {
    signIn,
}