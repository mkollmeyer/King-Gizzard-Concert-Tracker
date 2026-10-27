import { verifyPassword, hashPassword } from "../utils/password.ts";
import { generateSecureToken } from "../utils/auth.ts";
import { tokenService } from "../utils/token.ts";

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
        body: JSON.stringify({ username: username, password: await hashPassword(password) })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    const user: User = res.data;
    return user;
};

export async function signin(username: string, password: string): Promise<User> {
    const response = await fetch(`http://localhost:3000/api/user/username/${username}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Found username");
    const result = await response.json();
    const user: User = result.data;
    console.log(user.password);
    if (await verifyPassword(password, user.password)) {
        console.log("Password verified");
        return user;
    };
    console.log("Password verification failed");
    throw new Error("Invalid username or password");
};

export async function createSession(userID: string): Promise<Session> {
    const token = await generateSecureToken();
    await tokenService.setToken(token);
    console.log(token);
    const result = await fetch('http://localhost:3000/api/session/', {
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
    console.log(response.data);
    return response.data;
};