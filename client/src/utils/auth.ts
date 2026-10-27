import * as base32 from 'hi-base32';
import { type User, type Session } from '../router/userRoutes';

export function generateSecureToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return base32.encode(bytes).toLowerCase();
}

export async function getAuth(): Promise<{ session: Session | null; user: User | null; update: boolean }> {
    const token = localStorage.getItem('authToken');
    const result = await fetch(`http://localhost:3000/api/session/${token}`);
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    return result.json();
}

export async function signout(sessionID: string): Promise<void> {
    const result = await fetch(`http://localhost:3000/api/session/${sessionID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
}