import { verifyPassword } from "../utils/password.ts";
import { generateSecureToken } from "../utils/auth.ts";

export interface User {
    id: string;
    username: string;
    password: string;
};

export interface Session {
  id: string;
  userID: string;
  expiresAt: Date;
};

export async function createUser(username: string, password: string): Promise<User> {
    const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user;
};

export async function signin(username: string, password: string): Promise<User> {
    const response = await fetch(`http://localhost:3000/api/user/username/${username}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user: User = await response.json();
    if (await verifyPassword(password, user.password)) {
        return user;
    };
    return user;
};

export async function createSession(userID: string): Promise<Session> {
    const result = await fetch('http://localhost:3000/api/session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Token: generateSecureToken(), userID: userID })
    });
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    return result.json();
};