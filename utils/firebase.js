import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD8Z05bac_69VslhxBprCCxqHZg--DMSFA",
    authDomain: "subastas-3eae1.firebaseapp.com",
    projectId: "subastas-3eae1",
    storageBucket: "subastas-3eae1.appspot.com",
    messagingSenderId: "516624013392",
    appId: "1:516624013392:web:d9bc90caabafe43ba65955"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)