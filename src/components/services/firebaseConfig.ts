import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDoc ,getDocs, doc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, GoogleAuthProvider, getAuth, signInWithPopup, Auth, UserCredential, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Google Auth
const provider = new GoogleAuthProvider();
const auth: Auth = getAuth(app);

const signOutGoogleAccount = async () => {
  try {
    await signOut(auth);
    // O usuário foi desconectado com sucesso
    // Você pode fazer qualquer tratamento adicional aqui, como redirecionar o usuário para uma página de login.
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
    console.error('Erro ao autenticar:', error);
  }
}

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

      usersCollection = doc(db, 'users', user.uid);

      setDoc(usersCollection, userData)
        .then(() => {
          console.log('Documento adicionado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao adicionar documento:', error);
        });
    }  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }

}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export {auth, handleGoogleSignIn, signOutGoogleAccount}