"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./config";
import { getUserProfile } from "../firestore";

interface AuthContextType {
    user: User | null;
    role: string | null;
    isPro: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    isPro: false,
    loading: true,
    logout: async () => { },
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isPro, setIsPro] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (usr) => {
            setUser(usr);
            if (usr) {
                const profile = await getUserProfile(usr.uid);
                if (profile) {
                    setRole(profile.role || null);
                    setIsPro(profile.role === 'admin' || localStorage.getItem('warren_pro') === 'true');
                } else {
                    setRole(null);
                    setIsPro(localStorage.getItem('warren_pro') === 'true');
                }
            } else {
                setRole(null);
                setIsPro(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google sign in failed:", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Email sign in failed:", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, pass: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Email sign up failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            isPro,
            loading,
            logout,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
}
