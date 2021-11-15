import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC2s2ojO76wtSU8fo0QnHHN3wYk47pscKw",
    authDomain: "gdsccu-decd0.firebaseapp.com",
    projectId: "gdsccu-decd0",
    storageBucket: "gdsccu-decd0.appspot.com",
    messagingSenderId: "876586180057",
    appId: "1:876586180057:web:791ef6f49e9eb476818dc8"
};

export const Firebaseapp = initializeApp(firebaseConfig);

export const Firestore = getFirestore(Firebaseapp);

export const UsersCollectionRef = collection(Firestore, "Users");

export const auth = getAuth(Firebaseapp);

export const storage = getStorage(Firebaseapp)

export const storageRef = (Ref) => ref(storage, Ref);

export const setDocRef = (id, data) => setDoc(doc(Firestore, "Projects", id), data)