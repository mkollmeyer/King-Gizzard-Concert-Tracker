import express from "express"
import { createUser, getAllUsers, getUserById, getUserbyUsername, updateUser, deleteUser } from "../controllers/userController.ts"

const userRouter= express.Router();

userRouter.post("/user", createUser);
userRouter.get("/user", getAllUsers);
userRouter.get("/user/:id", getUserById);
userRouter.get("/user/username/:username", getUserbyUsername);
userRouter.put("/user/:id", updateUser);
userRouter.delete("/user/:id", deleteUser);

export default userRouter;