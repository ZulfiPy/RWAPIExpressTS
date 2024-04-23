import { Request, Response } from "express";
import User from "../model/User";
import dbConn from "../config/dbConn";

const signOut = async (req: Request, res: Response) => {
    if (!req?.cookies?.jwt) {
        return res.status(404).json({ "message": "There is not JWT cookie found in your cookies. You might be logged out. Refresh the page" });
    }

    await dbConn();

    const refreshToken = req.cookies.jwt;

    const foundUserByRefreshToken = await User.findOne({ refreshTokensArray: refreshToken });

    if (!foundUserByRefreshToken) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', });
        return res.status(404).json({ "message": "user not found by the JWT stored in the cookies" });
    }

    foundUserByRefreshToken.refreshTokensArray = foundUserByRefreshToken.refreshTokensArray.filter(rt => rt !== refreshToken);
    const result = await foundUserByRefreshToken.save();
    console.log('old refresh token clear out from the database', result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', });

    return res.status(200).json({ "message": "User have been successfully signed out." });
}

export {
    signOut
}