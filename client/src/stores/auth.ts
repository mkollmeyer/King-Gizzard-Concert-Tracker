import { defineStore } from "pinia";
import { createSession, createUser, signin } from "../router/userRoutes.ts";
import { create_user_setlists } from "../router/statRoutes.ts";
import { signout as invalidateSession } from "../utils/auth.ts";
import { tokenService } from "../utils/token.ts";
import { getAuth } from "../utils/auth.ts";

export interface AuthState {
    token: string | null,
    user: string | null,
    update: boolean,
    error: Error | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        user: null,
        update: false,
        error: null
    }),
    persist: true,
    getters: {
        getUser(): string | null {return this.user;},
        getSession(): string | null {return this.token;}
    },
    actions: {
        async registerUser(username: string, password: string): Promise<boolean> {
            this.error = null;
            try {
                const userCredential = await createUser(username, password);
                await create_user_setlists(userCredential.username);
                await createSession(userCredential.id);
                this.user = userCredential.username;
                this.token = tokenService.getToken();
                return true;
            } catch (error: unknown) {
                this.user = null;
                this.token = null;
                this.error = new Error(
                    error instanceof Error && error.message === 'Username already in use'
                        ? error.message
                        : 'Unable to create account'
                );
                return false;
            }
        },
        async login(username: string, password: string): Promise<boolean> {
            this.error = null;
            try {
                const userCredential = await signin(username, password);
                await createSession(userCredential.id);
                this.user = userCredential.username;
                this.token = tokenService.getToken();
                return true;
            } catch (error: unknown) {
                this.user = null;
                this.token = null;
                this.error = new Error('Unable to log in');
                return false;
            }
        },
        setUser(user: string | null) {
            this.user = user;
        },
        async clearExpiredSession() {
            const session = await getAuth();
            if (!session.session) return;
            const expiresAt = Date.parse(String(session.session.expiresAt));
            if (Number.isFinite(expiresAt) && Date.now() < expiresAt) return;
            this.user = null;
            this.token = null;
            this.error = null;
            tokenService.removeToken();
            try {
                await invalidateSession(session.session.id);
            } catch (error: unknown) {
                console.error("Unable to invalidate expired session:", error);
            }
        },
        async signout() {
            if (!this.token) {
                throw new Error("No active session to invalidate");
            }
            try {
                const invalid = await getAuth();
                await invalidateSession(invalid.session!.id);
                this.user = null;
                this.token = null;
                this.error = null;
            } catch (error: unknown) {
                this.error = error instanceof Error ? error : new Error("Unable to log out");
                throw error;
            }
        }
    }
});