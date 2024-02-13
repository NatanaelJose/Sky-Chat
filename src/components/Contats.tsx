import { useEffect, useState } from "react";
import { auth, createPrivateChat } from "./services/firebaseConfig";
import { fetchChats } from "./services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Contats = ({ navVisible, userData }: any) => {
  const [newFriend, setNewFriend] = useState("");
  const [userChats, setUserChats] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (userData.uid === newFriend || newFriend === "") return;

    try {
      await createPrivateChat(newFriend, userData.uid);
      setUserChats([...userChats, newFriend]);
      setNewFriend("");
    } catch (error) {
      console.error("Erro ao criar chat privado:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("teste");
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/");
        } else {
          fetchChats(setUserChats, currentUser.uid);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchData();

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchData();
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div
      className={`${
        navVisible ? "w-full md:w-2/6" : ""
      } h-screen bg-slate-200 dark:bg-gray-950`}
    >
      <div className="w-full h-screen bg-blue-400 dark:bg-gray-900 rounded-r-xl">
        <div className="h-2"></div>
        <div className="mt-4">
          <h2 className="text-white text-center">Conversas</h2>
          <ul className="text-white">
            {userChats.map((chatId: string) => (
              <li key={chatId}>{chatId}</li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-5/6 mx-auto bg-blue-500 dark:bg-gray-800 p-3 rounded-lg"
        >
          <div className="text-white text-center mb-2 ">
            Adicionar novos amigos
          </div>
          <input
            className="rounded-md bg-gray-100 focus:outline-none border-blue-500 border-2"
            onChange={(e) => setNewFriend(e.target.value)}
            type="text"
            placeholder="Digite o ID de seus amigos"
          />
        </form>
      </div>
    </div>
  );
};

export default Contats;
