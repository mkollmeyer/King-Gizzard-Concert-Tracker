import { defineStore } from "pinia";
import { createSession, createUser, signin, type Session } from "../router/userRoutes.ts";
import { type User } from "../router/userRoutes.ts";
import { create_user_setlists } from "../router/statRoutes.ts";
import { signout as invalidateSession } from "../utils/auth.ts";
import { tokenService } from "../utils/token.ts";

export interface AuthState {
    session: Session | null,
    user: User | null,
    update: boolean,
    error: Error | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        session: null,
        user: null,
        update: false,
        error: null
    }),
    persist: true,
    getters: {
        getUser(): User | null {return this.user;},
        getSession(): Session | null {return this.session;}
    },
    actions: {
        async registerUser(username: string, password: string): Promise<boolean> {
            this.error = null;
            try {
                const userCredential = await createUser(username, password);
                await create_user_setlists(userCredential.id);
                const session = await createSession(userCredential.id);
                this.user = userCredential;
                this.session = session;
                return true;
            } catch (error: unknown) {
                this.user = null;
                this.session = null;
                this.error = new Error('Unable to create account');
                return false;
            }
        },
        async login(username: string, password: string): Promise<boolean> {
            this.error = null;
            try {
                const userCredential = await signin(username, password);
                console.log("User signed in:", userCredential);
                const session = await createSession(userCredential.id);
                this.user = userCredential;
                this.session = session;
                return true;
            } catch (error: unknown) {
                this.user = null;
                this.session = null;
                this.error = new Error('Unable to log in');
                return false;
            }
        },
        setUser(user: User | null) {
            this.user = user;
        },
        async clearExpiredSession() {
            const session = this.session;
            if (!session) return;

            const expiresAt = Date.parse(String(session.expiresAt));
            if (Number.isFinite(expiresAt) && Date.now() < expiresAt) return;

            this.user = null;
            this.session = null;
            this.error = null;
            tokenService.removeToken();

            try {
                await invalidateSession(session.id);
            } catch (error: unknown) {
                console.error("Unable to invalidate expired session:", error);
            }
        },
        async signout() {
            if (!this.session) {
                throw new Error("No active session to invalidate");
            }
            try {
                await invalidateSession(this.session.id);
                this.user = null;
                this.session = null;
                this.error = null;
            } catch (error: unknown) {
                this.error = error instanceof Error ? error : new Error("Unable to log out");
                throw error;
            }
        }
    }
});