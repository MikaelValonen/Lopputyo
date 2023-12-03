import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const FirebaseContext = createContext();

const firebaseConfig = {
  apiKey: "AIzaSyCrxcNfz4PD4fOgXXPlC6PTClTR7JOCIEU",
  authDomain: "ostoslistafirebase-6547f.firebaseapp.com",
  databaseURL: "https://ostoslistafirebase-6547f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ostoslistafirebase-6547f",
  storageBucket: "ostoslistafirebase-6547f.appspot.com",
  messagingSenderId: "70140162796",
  appId: "1:70140162796:web:e910c203182dd87bc3ebc9",
  measurementId: "G-L8K1M6BNKK"
};

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {
  const [firebaseInstance, setFirebaseInstance] = useState(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      setFirebaseInstance({ app, database });
    } catch (error) {
      // Handle initialization error
      console.error('Firebase initialization error:', error);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseInstance}>
      {children}
    </FirebaseContext.Provider>
  );
}

