import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfnUclsTg8PZQ6SHalhkzw2PcekASC4gI",
  authDomain: "bookify-1dff3.firebaseapp.com",
  projectId: "bookify-1dff3",
  storageBucket: "bookify-1dff3.appspot.com",
  messagingSenderId: "656397056522",
  appId: "1:656397056522:web:2eac096fe12250508dfdf3",
  measurementId: "G-EFYJF7B04R",
};

const app = initializeApp(firebaseConfig);

//const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
