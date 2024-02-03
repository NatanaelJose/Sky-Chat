import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import {
  User,
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  Auth,
  UserCredential,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut,
  FirebaseError,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

//messages
const messagesGlobal = async() => {
  try{
    const messageRef =
  }catch{}
}
// Google Auth
const provider = new GoogleAuthProvider();
const auth: Auth = getAuth(app);

const signOutGoogleAccount = async () => {
  try {
    await signOut(auth);

  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

async function handleGoogleSignIn() {
  try {
    let result: UserCredential | null;
    if (isMobileDevice()) {
      await signInWithRedirect(auth, provider);
      result = await getRedirectResult(auth);
    } else {
      result = await signInWithPopup(auth, provider);
    }
    if (result != null) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token: string | null = credential?.accessToken || null;
      const user = result.user;
      try {
        const userAgent = doc(db, "users", user.uid);
        const docSnap = await getDoc(userAgent);
        if (!docSnap.exists()) {
          await createUser();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  } catch (error) {
    console.error("Erro ao autenticar:", error);
  }
}

const handleEmail = async (email: string, password: string, type: string): Promise<string | null> => {
  try {
    if (type === "register") {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        const userAgent = doc(db, "users", user.uid);
        const docSnap = await getDoc(userAgent);

        if (!docSnap.exists()) {
          await createUser();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return "Error fetching data";
      }

      return "Registration successful";
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      return "Login successful";
    }
  } catch (error:FirebaseError) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === "auth/email-already-in-use") {
      console.error("Email already in use. Please use a different email or try logging in.");
      return "Email already in use";
    } else {
      console.error(errorMessage);
      return "Unexpected error";
    }
  }
};

async function createUser() {
  try {
    const user: User | null = getAuth().currentUser;
    let userData;
    let usersCollection;
    if (user !== null) {
      userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      };

      usersCollection = doc(db, "users", user.uid);

      setDoc(usersCollection, userData)
        .then(() => {
          console.log("Documento adicionado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao adicionar documento:", error);
        });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export { auth, handleGoogleSignIn, signOutGoogleAccount, handleEmail};
