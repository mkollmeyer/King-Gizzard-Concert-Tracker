import express from "express"
import { createSet, getAllSet, getSetById, updateSet, deleteSet, get_setlists } from "../controllers/setlistController.ts"

const setRouter= express.Router();

setRouter.post("/set", createSet);
setRouter.get("/set", getAllSet);
setRouter.get("/set/api/:date", get_setlists);
setRouter.get("/set/:id", getSetById);
setRouter.post("/set/:id", updateSet);
setRouter.delete("/set/:id", deleteSet);

export default setRouter;