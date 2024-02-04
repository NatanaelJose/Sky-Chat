import { useState, useEffect, useRef } from 'react';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './services/firebaseConfig';

interface Message {
  id: string;
  text: string;
  uid: string;
  imageSrc?: string;
}

const ChatMessage = (props: any) => {
  const { text, uid, key, imageSrc } = props.message;

  const messageClass = `flex items-center space-x-3 p-5 mb-5 rounded-3xl ${
    uid === props.currentUserUid ? 'bg-gray-800 ml-auto self-end' : 'bg-blue-800'
  }`;

  return (
    <div className="flex flex-row items-center w-4/6" key={key}>
      {uid !== props.currentUserUid && imageSrc && (
        <img
          src={imageSrc}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className={messageClass}>
        <p className='text-white break-all' >{text}</p>
      </div>
    </div>
  );
};

const Chat = (props: any) => {
  const { userData } = props;
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const messageRef = collection(db, 'globalMessages');
    const queryMessages = query(messageRef, orderBy("createdAt", "desc"), limit(25));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.unshift({ ...doc.data(), id: doc.id } as Message); 
      });

      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!userData) {
      return;
    }

    if (newMessage === '') return;

    const messageRef = collection(db, 'globalMessages');
    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: userData.uid,
      imageSrc: userData.imageSrc,
    });

    setNewMessage("");
  };

  return (
    <div className="w-full h-screen flex flex-col justify-end dark:bg-gray-950 pb-5">
      <div className="flex flex-col overflow-y-scroll items-center">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} currentUserUid={userData?.uid} imageSrc={msg.imageSrc} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-2 flex flex-row justify-center">
        <input 
          className='pl-2 w-3/5 rounded-xl' 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <button type="submit" className='ml-3 p-3 rounded-2xl text-white bg-blue-800'>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;