import { useState, useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./services/firebaseConfig";
import defaultSrc from "../assets/images/default-profile-pic.png";
import ProfanityFilter from "bad-words";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./Chat.css";

interface Message {
  id: string;
  text: string;
  uid: string;
  imageSrc?: string;
}

const profanityFilter = new ProfanityFilter();

const updateChatMessage = async (
  id: string,
  newText: string,
  chatRoom: string
) => {
  try {
    await updateDoc(doc(db, chatRoom, id), {
      text: newText,
      updatedAt: serverTimestamp(),
    });
    console.log("Documento atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar o documento:", error);
  }
};

const deleteChatMessage = async (id: string, chatRoom: string) => {
  try {
    if (!id || !chatRoom) {
      console.error("ID do documento ou sala de bate-papo não especificada.");
      return;
    }

    await deleteDoc(doc(db, chatRoom, id));
    console.log("Documento excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir o documento:", error);
  }
};

const ChatMessage = (props: any) => {
  const { text, uid, key, imageSrc, id } = props.message;
  const chatRoom = props.chat;
  const isNavbarOpen = props.navbar;
  const [showOptions, setShowOptions] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const messageClass = `flex items-center space-x-3 p-4 mb-5 rounded-3xl max-w-[69%] ${
    uid === props.currentUserUid
      ? "dark:bg-gray-800 bg-blue-700 ml-auto self-end"
      : "dark:bg-blue-700 bg-blue-800"
  }`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };

    const isMounted = menuRef.current;
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (isMounted) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const handleSaveEdit = () => {
    if (editedText === "") return;
    updateChatMessage(id, editedText, chatRoom);
    setIsEditing(false);
  };

  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const buttonRect = event.currentTarget.getBoundingClientRect();
    let menuX = buttonRect.left;
    const menuY = buttonRect.bottom;

    const menuWidth = 150;
    const windowWidth = window.innerWidth;
    if (menuX + menuWidth > windowWidth) {
      menuX = windowWidth - menuWidth;
    }

    setMenuPosition({ x: menuX, y: menuY });
    toggleMenu();
  };

  const handleDelete = async () => {
    await deleteChatMessage(id, chatRoom);
  };

  return (
    <div className={`flex flex-row items-center w-[95%] sm:w-[69%] ${isNavbarOpen ? 'hidden' : 'block'}`} key={key}>
      {uid !== props.currentUserUid &&
        (imageSrc ? (
          <img
            src={imageSrc}
            alt="Profile"
            className="w-10 h-10 mx-2 rounded-full"
          />
        ) : (
          <img
            src={defaultSrc}
            alt="Profile"
            className="w-10 h-10 mx-2 rounded-full"
          />
        ))}
      <div
        className={messageClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditing ? (
          <input
            className="border dark:text-white bg-white dark:bg-gray-800 rounded border-blue-500 focus:outline-none"
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveEdit();
                setMenuVisible(false);
              }
            }}
          />
        ) : (
          <p className={`text-white break-all`}>{text}</p>
        )}
        {uid === props.currentUserUid && showOptions && (
          <button className="text-white" onClick={handleMenuClick}>
            ⋮
          </button>
        )}

        {menuVisible && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
            }}
            className="py-1 w-max bg-white dark:text-white dark:bg-gray-700 border border-blue-500 rounded-lg shadow-2xl z-20"
          >
            <div
              onClick={handleDelete}
              className="block px-3 py-2 w-24 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer"
            >
              Excluir
            </div>
            {!isEditing && (
              <div
                onClick={handleEdit}
                className="block px-3 py-2 w-24 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer"
              >
                Editar
              </div>
            )}
            {isEditing && (
              <div
                onClick={handleSaveEdit}
                className="block px-3 py-2 w-24 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer"
              >
                Salvar
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Chat = (props: any) => {
  const { userData, chat } = props;
  const [newMessage, setNewMessage] = useState("");

  const navbar = props.navVisible ? props.navVisible : false;
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  let chatRoom = chat;

  useEffect(() => {
    const messageRef = collection(db, chatRoom);
    const queryMessages = query(
      messageRef,
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.unshift({ ...doc.data(), id: doc.id } as Message);
      });

      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!userData) {
      return;
    }

    if (newMessage === "") return;

    const cleanedMessage = profanityFilter.clean(newMessage);
    const messageRef = collection(db, chatRoom);
    await addDoc(messageRef, {
      text: cleanedMessage,
      createdAt: serverTimestamp(),
      uid: userData.uid,
      imageSrc: userData.imageSrc,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-300 dark:bg-gray-950">
      <div className={`flex flex-col flex-grow w-full overflow-y-scroll scroll-smooth items-center`}>
        <TransitionGroup className="w-full mx-auto flex justify-center flex-col items-center">
          {messages.map((msg) => (
            <CSSTransition key={msg.id} classNames="message" timeout={500}>
              <ChatMessage
                message={msg}
                currentUserUid={userData?.uid}
                chat={chatRoom}
                navbar={navbar}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`p-2 flex flex-row justify-center`}
      >
        <input
          className="pl-2 w-full sm:w-3/5 rounded-xl bg-gray-100 focus:outline-none border-blue-500 border-2"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button
          type="submit"
          className="ml-3 p-3 rounded-2xl text-white bg-blue-700 hover:bg-blue-800"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
