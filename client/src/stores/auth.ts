import { defineStore } from "pinia";
import { createSession, createUser, signin, type Session } from "../router/userRoutes.ts";
import { type User } from "../router/userRoutes.ts";
import { create_user_setlists } from "../router/statRoutes.ts";
import { signout } from "../utils/auth.ts";

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
        async registerUser(username: string, password: string) {
            this.error = null;
            try {
                const userCredential = await createUser(username, password);
                this.user = userCredential;
                await create_user_setlists(userCredential.id);
                this.session = await createSession(userCredential.id);
                console.log(this.user.username);
                console.log(this.session.id);
            } catch (error: unknown) {
                if (error instanceof Error) {this.error = error;}
            }
        },
        async login(username: string, password: string) {
            this.error = null;
            try {
                const userCredential = await signin(username, password);
                console.log("User signed in:", userCredential);
                this.user = userCredential;
                this.session = await createSession(userCredential.id);
            } catch (error: unknown) {
                if (error instanceof Error) {this.error = error;}
            }
        },
        setUser(user: User | null) {
            this.user = user;
        },
        async signout() {
            try {
                await signout((this.session!.id));
                this.user = null;
                this.session = null;
            } catch (error) {
                console.error("Error signing out user:", error);
            }
        }
    }
});