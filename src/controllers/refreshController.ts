import { Request, Response } from "express";
import User from "../model/User";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

const refreshTokens = async (req: Request, res: Response) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

    const cookies = req?.cookies;
    if (!cookies?.jwt || Object.keys(cookies?.jwt).length === 0) {
        return res.status(401).json({ "message": "you do not have refresh token stored in the cookies, you have to login or provide a refresh token" });
    }

    const oldRefreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    const foundUser = await User.findOne({ refreshTokensArray: oldRefreshToken });

    if (!foundUser) {
        console.log('user not found', foundUser)
        jwt.verify(
            oldRefreshToken,
            refreshTokenSecret,
            async (err: jwt.VerifyErrors | null, decoded: any) => {
                if (err) return res.status(401).json({ "message": "token expired" });

                const hackedUser = await User.findOne({ username: decoded?.username });

                if (!hackedUser) {
                    return res.status(404).json({ "message": "No user found with the refresh token" });
                }

                hackedUser.refreshTokensArray = [];
                const result = await hackedUser.save();
                console.log('hackedUser', result);
            }
        )
        return res.sendStatus(403);
    }

    const refreshTokensArray = foundUser.refreshTokensArray.filter(token => token !== oldRefreshToken);

    jwt.verify(
        oldRefreshToken,
        refreshTokenSecret,
        async (err: VerifyErrors | null, decoded: JwtPayload | string | any) => {
            if (err) {
                console.log(err)
                foundUser.refreshTokensArray = refreshTokensArray;
                const result = await foundUser.save();
                console.log('result', result);
            }

            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const newAccessToken = jwt.sign(
                {
                    "UserInfo": {
                        username: foundUser.username,
                        roles: Object.values(foundUser.roles).filter(Boolean)
                    }
                },
                accessTokenSecret,
                { expiresIn: "1h" }
            );

            const newRefreshToken = jwt.sign(
                { username: foundUser.username },
                refreshTokenSecret,
                { expiresIn: "4h" }
            );

            foundUser.refreshTokensArray = [...refreshTokensArray, newRefreshToken];
            const result = await foundUser.save();
            console.log('refresh update is done', result);

            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true });

            return res.status(200).json({ "jwt": newAccessToken });
        }
    );
}

export {
    refreshTokens
}