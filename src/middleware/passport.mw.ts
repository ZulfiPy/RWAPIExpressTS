import { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
import { VerifiedCallback } from "passport-jwt";
import dbConn from "../config/dbConn";

import User from "../model/User";

interface JwtPayload {
    UserInfo: {
        username: string;
        roles: string[],
    }
}

interface JwtOptions {
    jwtFromRequest: passportJWT.JwtFromRequestFunction<any>;
    secretOrKey: string;
}

export async function initPassport(app: Express) {
    const jwtStrategy = passportJWT.Strategy;
    const ExtractJWT = passportJWT.ExtractJwt;

    const jwtOptions: JwtOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
    }

    app.use(passport.initialize());

    passport.use(new jwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
        if (jwtPayload) {
            await dbConn();
            const { username } = jwtPayload?.UserInfo;
            try {
                const user = await User.findOne({ username });
                if (!user) done(null, false);
                done(null, jwtPayload.UserInfo);
            } catch (error) {
                console.log('some error occured while looking for a user in the dabase', error);
            }
        } else {
            done(null, false);
        }
    }));
}