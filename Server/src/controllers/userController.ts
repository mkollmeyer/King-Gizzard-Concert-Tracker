import { Users } from "../models/userModel.ts";
import { type Request, type Response } from 'express';
import { createSet } from "./setlistController.ts";

const handleResponse = (res: Response, status: number, message: string, data: any = null) => {
    res.status(status).json({
        status,
        message,
        data
    })
};

export const createUser = async(req: Request, res: Response, next: Function) => {
    const uid = crypto.randomUUID();
    try {
        const newUser = await Users.insertOne({
            id: uid,
            username: req.body.username,
            password: req.body.password
        });
        handleResponse(res, 201, "User created", newUser);
    } catch (err){
        next(err);
    }
};
export const getAllUsers = async(req: Request, res: Response, next: Function) => {
    try {
        const allUsers = await Users.find();
        handleResponse(res, 200, "Users retrieved", allUsers);
    } catch (err){
        next(err);
    }
};
export const getUserById = async(req: Request, res: Response, next: Function) => {
    try {
        const user = await Users.findById(req.params.id);
        if(!user) return handleResponse(res, 404, "User not found");
        handleResponse(res, 200, "User retrieved", user);
    } catch (err){
        next(err);
    }
};
export const getUserbyUsername = async(req: Request, res: Response, next: Function) => {
    try {
        const user = await Users.findOne({ username: req.params.username as string });
        if(!user) return handleResponse(res, 404, "User not found");
        console.log("Found user:", user);
        handleResponse(res, 200, "User retrieved", user);
    } catch (err){
        next(err);
    }
};
export const updateUser = async(req: Request, res: Response, next: Function) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
            password: req.body.password
        });
        if(!updatedUser) return handleResponse(res, 404, "User not found");
        handleResponse(res, 200, "User updated", updatedUser);
    } catch (err){
        next(err);
    }
};
export const deleteUser = async(req: Request, res: Response, next: Function) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        if(!deletedUser) return handleResponse(res, 404, "User not found")
        handleResponse(res, 200, "User deleted", deletedUser)
    } catch (err){
        next(err);
    }
};