import { initializeApp } from "firebase/app";

import {
  getFirestore,
  Firestore,
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  User,
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
  signOut,
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
const db:Firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

// Google Auth
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
    let result: UserCredential | null = await signInWithPopup(auth, provider);
    if (result != null) {
      GoogleAuthProvider.credentialFromResult(result);
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

const handleEmail = async (userName: string, email: string, password: string, type: string): Promise<string | null> => {
  try {
    if (type === "register") {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      try {
        const userAgent = doc(db, "users", user.uid);
        const docSnap = await getDoc(userAgent);

        if (!docSnap.exists()) {
          await createUserEmail(userName);
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
  } catch (error:any) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === "auth/email-already-in-use") {
      console.error("Email already in use. Please use a different email or try logging in.");
      return "Email já em uso";
    } else {
      console.error(errorMessage);
      return "Unexpected error";
    }
  }
};

async function createUserEmail(name:string) {
  try {
    const user: User | null = getAuth().currentUser;
    let userData;
    let usersCollection;
    if (user !== null) {
      userData = {
        uid: user.uid,
        displayName: name,
        email: user.email,
        chats: ['global'],
        imageSrc: '',
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
        chat:["global"],
        imageSrc:user.photoURL,
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

async function searchUser(uid:any) {
  try {
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('uid', '==', uid));

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      console.log('Usuário não encontrado');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw error;
  }
}

const createPrivateChat = async (idAmigo:string, meuId:string) => {
  const nomeColecao = `new${idAmigo}${meuId}`;

  await setDoc(doc(db, nomeColecao, "firstMessage"), {
    name: "ola, mundo",
  });

  const userRef = doc(db, "users", meuId);
  await updateDoc(userRef, {
    chat: arrayUnion(nomeColecao)
});
  return nomeColecao;
};

const fetchChats = async (setUserChats:any, userId:any) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserChats(docSnap.data().chat)
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Erro ao buscar chats:", error);
  }
};




export { db ,  auth, handleGoogleSignIn, signOutGoogleAccount, handleEmail, searchUser, createPrivateChat, fetchChats};
export type FirebaseUser = import("firebase/auth").User;
