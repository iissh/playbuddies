import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { View, Text } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { 
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from "@firebase/auth";
import { auth } from '../firebase';


const AuthContext = createContext({
    // initial state...
});

const config = {
    iosClientId: REMOVED DUE TO SENSITIVE INFORMATION
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);

    const [loading, setLoading] = useState(false);

    useEffect(() => onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoadingInitial(false);
        }), []);

    const logout = async () => {
        setLoading(true);
        signOut(auth).catch(error => setError(error)).finally(() => setLoading(false));
    }

    const signInWithGoogle = async () => {
        setLoading(true);
        await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === "success") {
                const { idToken, accessToken } = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential);
            }

            return Promise.reject();
        }).catch(error => setError(error))
        .finally(() => setLoading(false));
    };

    const memoedValue = useMemo(() => ({
        user,
        loading, 
        error,
        signInWithGoogle,
        logout
    }), [user, loading, error])

    return (
        <AuthContext.Provider 
            value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}
