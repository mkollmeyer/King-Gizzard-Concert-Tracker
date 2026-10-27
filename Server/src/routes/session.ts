import express from "express"
import { createSession, invalidateSession, validateSessionToken } from "../controllers/sessionController.ts";

const sessionRouter= express.Router();

sessionRouter.post("/session/", createSession);
sessionRouter.get("/session/:token", validateSessionToken);
sessionRouter.delete("/session/:id", invalidateSession);

export default sessionRouter;