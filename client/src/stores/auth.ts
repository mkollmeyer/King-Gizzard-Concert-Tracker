import { defineStore } from "pinia";
import { createSession, createUser, signin, type Session } from "../router/userRoutes.ts";
import { type User } from "../router/userRoutes.ts";
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
        getUser(): User | null {return this.user;}
    },
    actions: {
        async registerUser(username: string, password: string) {
            this.error = null;
            try {
                const userCredential = await createUser(username, password);
                this.user = userCredential;
            } catch (error: unknown) {
                if (error instanceof Error) {this.error = error;}
            }
        },
        async login(username: string, password: string) {
            this.error = null;
            try {
                const userCredential = await signin(username, password);
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
                console.log("User signed out")
            } catch (error) {
                console.error("Error signing out user:", error);
            }
        }
    }
});