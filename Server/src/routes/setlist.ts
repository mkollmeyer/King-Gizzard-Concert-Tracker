import express from "express"
import { createSet, getAllSet, getSetById, updateSet, deleteSet } from "../controllers/setlistController.ts"

const setRouter= express.Router();

setRouter.post("/set", createSet);
setRouter.get("/set", getAllSet);
setRouter.get("/set/:id", getSetById);
setRouter.put("/set/:id", updateSet);
setRouter.delete("/set/:id", deleteSet);

export default setRouter;