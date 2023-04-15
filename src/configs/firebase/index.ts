import firebase from "firebase/compat/app"
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCs18HqdsyQVUsH35QaQH-smhRme9ZreZA",
    authDomain: "todo-d9732.firebaseapp.com",
    projectId: "todo-d9732",
    storageBucket: "todo-d9732.appspot.com",
    messagingSenderId: "636637761937",
    appId: "1:636637761937:web:a73acbd77e682d44c88a30",
    measurementId: "G-HL21FR1X7S"
};

// Initialize Firebase
const init = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const db = getFirestore(init)


export default firebase

