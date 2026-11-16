import { type User, type Session } from '../router/userRoutes';
import { tokenService } from './token';

export async function getAuth(): Promise<{
    session: Session | null;
    user: Pick<User, 'id' | 'username'> | null;
    update: boolean;
}> {
    const token = tokenService.getToken();
    if (!token) {
        return { session: null, user: null, update: false };
    }

    const result = await fetch('/api/sessions/current', {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (result.status === 401) {
        return { session: null, user: null, update: false };
    }
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    return result.json();
}

export async function signout(): Promise<void> {
    const token = tokenService.getToken();
    if (!token) {
        tokenService.removeToken();
        return;
    }

    const result = await fetch('/api/sessions/current', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    tokenService.removeToken();
}