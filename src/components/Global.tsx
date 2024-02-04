import NavBar from "./Navbar";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { auth } from "./services/firebaseConfig";
import { useNavigate } from 'react-router-dom';
import {searchUser} from "./services/firebaseConfig";

interface User {
  uid: string;
  email: string;
}

const Global = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAuth = auth.currentUser;
        if (!userAuth) {
          navigate("/");
        } else {
          setUser(userAuth);
          const userData = await searchUser(userAuth.uid);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchData();

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchData();
    });

    return () => unsubscribe();
  }, [navigate]);


console.log(userData)
  return (
    <div className="flex flex-row">
      <NavBar isSelected={1} />
      <Chat userData={userData} centered={true} />
    </div>
  );
}

export default Global;
