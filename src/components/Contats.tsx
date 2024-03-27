import { useEffect, useState } from "react";
import { auth, createPrivateChat } from "./services/firebaseConfig";
import { fetchChats } from "./services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import defaultSrc from "../assets/images/default-profile-pic.png";

interface ChatInfo {
  amigoNome: string;
  amigoImg: string;
  chatRoom: string;
}

const ModelContats: React.FC<{
  index: number;
  chatInfo: ChatInfo;
  selectedChatIndex: string;
  setChat: any;
}> = ({ index, chatInfo, selectedChatIndex, setChat }) => {
  const isSelected = chatInfo.chatRoom === selectedChatIndex;
  const handleChatClick = () => {
    setChat(chatInfo.chatRoom);
  };
  return (
    <li
      onClick={handleChatClick}
      className={`flex flex-row w-full h-auto p-3 items-center shadow-sm dark:shadow-gray-800 hover:bg-sky-600 dark:hover:bg-gray-700 transition duration-400 cursor-pointer ${
        isSelected ? "dark:bg-gray-700 bg-sky-600" : ""
      }`}
      key={index}
    >
      <img
        className="h-14 w-14 rounded-full"
        src={chatInfo.amigoImg ? chatInfo.amigoImg : defaultSrc}
        alt={chatInfo.amigoNome}
      />
      <div className="text-center ml-2 break-word">{chatInfo.amigoNome}</div>
    </li>
  );
};

const Contats = ({ navVisible, userData, chat, setChat }: any) => {
  const [newFriend, setNewFriend] = useState("");
  const [userChats, setUserChats] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (userData.uid === newFriend || newFriend === "") return;

    try {
      await createPrivateChat(newFriend, userData.uid, setUserChats);
      setUserChats([...userChats, newFriend]);
      setNewFriend("");
    } catch (error) {
      console.error("Erro ao criar chat privado:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
        navVisible ? "w-full md:w-2/5" : "w-0"
      } h-screen bg-slate-200 dark:bg-gray-950`}
    >
      <div className="w-full h-screen bg-blue-400 dark:bg-gray-900 rounded-r-xl p-1">
        <div className="h-1"></div>
        <div className="mt-2">
          <h2 className="text-white text-xl font-bold text-center mb-2">
            Conversas
          </h2>
          <ul className="text-white max-h-72 overflow-y-auto">
            {userChats &&
              userChats.map((chatInfo: any, index: number) => (
                <ModelContats
                  key={chatInfo.chatRoom}
                  index={index}
                  chatInfo={chatInfo}
                  selectedChatIndex={chat}
                  setChat={setChat}
                />
              ))}
          </ul>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-5/6 mx-auto bg-blue-500 dark:bg-gray-800 mt-3 p-3 rounded-lg"
        >
          <div className="text-white text-center mb-2">
            Adicionar novos amigos
          </div>
          <input
            className="rounded-md bg-gray-100 focus:outline-none border-blue-500 border-2 p-1"
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
