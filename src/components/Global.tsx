import NavBar from "./Navbar";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { auth } from "./services/firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { searchUser } from "./services/firebaseConfig";

interface User {
  uid: string;
  email: string;
}

const Global = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/");
        } else {
          const userData = await searchUser(currentUser.uid);
          setUserData(userData as User);
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

  return (
    <div className="flex flex-row">
      <NavBar isSelected={1} />
      <Chat userData={userData} centered={true} />
    </div>
  );
}

export default Global;
