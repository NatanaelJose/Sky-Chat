import Chat from "./Chat";
import NavBar from "./Navbar";
import { useEffect, useState } from "react";
import { auth } from "./services/firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { searchUser } from "./services/firebaseConfig";
import Contats from "./Contats";

interface User {
  uid: string;
  email: string;
}

const Private = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [navVisible, setNavVisible] = useState(true);
    const [chat, setChat] = useState('globalMessages');

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
        <NavBar isSelected={2} navVisible={navVisible} setNavVisible={setNavVisible} />
        <Contats navVisible={navVisible} userData={userData} chat={chat} setChat={setChat}/>
        <Chat userData={userData} chat={chat}/>
      </div>
    );
}

export default Private;