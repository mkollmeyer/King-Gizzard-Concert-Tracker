import { verifyPassword } from "../utils/password.ts";

export interface User {
    username: string;
    password: string;
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
    const user = await response.json();
    if (await verifyPassword(password, user.password)) {
        return user;
    }
    return user;
};