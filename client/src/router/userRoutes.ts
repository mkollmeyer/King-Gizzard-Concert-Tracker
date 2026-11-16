import { hashPassword } from "../utils/password.ts";
import { generateSecureToken } from "../utils/auth.ts";
import { tokenService } from "../utils/token.ts";

export interface User {
    id: string;
    username: string;
};

export interface Session {
  id: string;
  userID: string;
  expiresAt: Date;
};

export async function createUser(username: string, password: string): Promise<User> {
    const response = await fetch('/api/user/create_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: await hashPassword(password) })
    });
    if (!response.ok) {
        if (response.status === 409) {
            throw new Error('Username already in use')
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    const user: User = res.data;
    return user;
};

export async function signin(username: string, password: string): Promise<User> {
    const response = await fetch('/api/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
};

export async function createSession(userID: string): Promise<Session> {
    const token = await generateSecureToken();
    await tokenService.setToken(token);
    const result = await fetch('/api/sessions/create_session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Token: token, userID: userID })
    });
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    const response = await result.json();
    return response.data;
};