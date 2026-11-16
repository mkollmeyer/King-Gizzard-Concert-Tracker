import { hashPassword } from "../utils/password.ts";

export interface User {
    id: string;
    username: string;
};

export interface AuthenticatedUser extends User {
    token: string;
};

export interface Session {
  id: string;
  userID: string;
  expiresAt: Date;
};

export async function createUser(username: string, password: string): Promise<AuthenticatedUser> {
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
    return res.data;
};

export async function signin(username: string, password: string): Promise<AuthenticatedUser> {
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