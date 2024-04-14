import { Request, Response, NextFunction } from "express";

interface UserType { 
    username: string;
    roles: number[]
}

export function isAuthorized(allowedRoles: number[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req?.user) return res.status(401).json({ "message": "you are not authenticated" });

        const user = req.user as UserType;

        const allowedRolePersists = user.roles.some(role => allowedRoles.includes(role));
        if (!allowedRolePersists) {
            return res.status(403).json({ "message": "you are not authorized" });
        }

        return next();
    }
}