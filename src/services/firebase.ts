import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA03atHNoy3mBWHlakyNvCq7CbYZbYI5as",
    authDomain: "noteappwithfirebase-5a2b2.firebaseapp.com",
    projectId: "noteappwithfirebase-5a2b2",
    storageBucket: "noteappwithfirebase-5a2b2.firebasestorage.app",
    messagingSenderId: "G-X1LJW7W7WL",
    appId: "1:575907346368:web:ca6072e2489a220f54fa25"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
