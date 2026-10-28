import { sessions, type Session } from "../models/sessionModel.ts";
import { Users, type User } from "../models/userModel.ts";
import { createHash } from 'node:crypto';
import { type Request, type Response } from 'express';
import * as base32 from 'hi-base32';

const handleResponse = (res: Response, status: number, message: string, data: any = null) => {
    res.status(status).json({
        status,
        message,
        data
    })
};

export type SessionValidationResult =
	| { session: Session; user: User, update: boolean }
	| { session: null; user: null, update: boolean };

export const createSession = async (req: Request, res: Response, next: Function) => {
	const sessionId = base32.encode(createHash('sha256').update(req.body.Token , 'utf8').digest()).toLowerCase();
	try {
		const session: Session = await sessions.insertOne ({
			id: sessionId,
			userID: req.body.userID,
			expiresAt: new Date(Date.now() + 1000 * 60 * 30)
		});
		handleResponse(res, 201, "Session created", session);
	} catch (error) {
		next(error);
	}
}

export async function invalidate(sessionId: string): Promise<void> {
    const session = await sessions.findByIdAndDelete(sessionId);
}

export const invalidateSession = async (req: Request, res: Response, next: Function) => {
    const session = await sessions.findByIdAndDelete(req.params.sessionId);
    handleResponse(res, 200, "Session invalidated", session);
}

export const validateSessionToken = async(req: Request, res: Response, next: Function) => {
	const sessionId = base32.encode(createHash('sha256').update(req.body.token, 'utf8').digest()).toLowerCase();
	const result = await sessions.aggregate([
        {
            $match: { id: sessionId }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userID',
                foreignField: 'id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        }
    ]);

	if (result.length < 1) {
		return { session: null, user: null, update: false };
	}

	const { user, session } = result[0];

	if (Date.now() >= session.expiresAt.getTime()) {
		await invalidate(session.id);
		return { session: null, user: null, update: false };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await sessions.updateOne(
			{ id: session.id },
			{ $set: { expiresAt: session.expiresAt } }
		);
		handleResponse(res, 200, "Session validated", { session, user, update: true });
	}
	handleResponse(res, 200, "Session validated", { session, user, update: false });
}