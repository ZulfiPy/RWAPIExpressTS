import { Request, Response } from "express";

export interface UserAuthPayload {
        username: string,
        roles: number[]
}