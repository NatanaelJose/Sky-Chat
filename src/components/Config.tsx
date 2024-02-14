import { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import NavBar from "./Navbar";
import { searchUser, auth } from "./services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import defaultSrc from '../assets/images/default-profile-pic.png';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  imageSrc: string;
}

const HandleTheme = () => {
  const { darkMode, toggleTheme }: ThemeContextType = useTheme() || {
    darkMode: false,
    toggleTheme: () => {},
  };

  return (
    <div>
      <button
        className="bg-sky-500 text-white p-2 rounded-3xl"
        onClick={toggleTheme}
      >
        {darkMode ? "Modo Escuro" : "Modo Claro"}
      </button>
    </div>
  );
};

const Config = () => {
  const [navVisible, setNavVisible] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [copied, setCopied] = useState(false); 

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/");
        } else {
          const userData = await searchUser(currentUser.uid);
          setUserData(userData as UserData);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(userData?.uid || "Error");
    setCopied(true); 
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div className="flex flex-row">
      <NavBar
        isSelected={3}
        navVisible={navVisible}
        setNavVisible={setNavVisible}
      />
      <div className="w-full h-screen flex flex-col items-center dark:bg-gray-950 bg-gray-200">
        <div className="w-full lg:w-2/6  dark:bg-gray-800 bg-slate-300 h-auto lg:h-40 mt-40 lg:mt-2 border shadow-md flex flex-row justify-center">
          <div className="flex flex-row items-center justify-center">
            <img
              src={userData?.imageSrc ? userData?.imageSrc : defaultSrc }
              alt={userData?.displayName || ""}
              className="w-20 h-20 object-cover rounded-lg mr-4"
            />
            <div className="text-left">
              <div className="dark:text-white text-xl">{userData?.displayName}</div>
              <div className="dark:text-white mb-1 text-base">{userData?.email}</div>
              <div onClick={handleCopy} className="dark:text-white text-sm hover:cursor-pointer hover:text-sky-500 hover:underline dark:hover:text-sky-500">{userData?.uid} {copied && <span className="text-green-600 ml-2">Copiado!</span>}</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[96%] h-20 flex flex-row items-center mt-10 p-2 rounded-2xl">
          <p className="mr-3 dark:text-white">Trocar de tema: </p>
          <HandleTheme />
        </div>
      </div>
    </div>
  );
};

export default Config;
