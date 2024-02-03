import { useState, useEffect } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './services/firebaseConfig';

interface Message {
  id: string;
  text: string;
  uid: string;
}

const ChatMessage = (props: any) => {
  const { text, uid, key } = props.message;
  return <p key={key}  className='text-white'>{text}</p>;
};

const Chat = (props: any) => {
  const { user } = props;
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = collection(db, 'globalMessages');

  useEffect(() => {
    const queryMessages = query(messageRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ ...doc.data(), id: doc.id } as Message);
      });

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    if (newMessage === '') return;

    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user.displayName,
    });

    setNewMessage("");
  };

  return (
    <div className="w-full h-screen flex flex-col dark:bg-gray-950 pb-5">
      <div className="flex-grow overflow-y-scroll p-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-2 flex flex-row justify-center">
        <input className='pl-2 w-4/5 rounded-xl ' type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button type="submit" className='ml-3 p-3 rounded-2xl text-white bg-blue-800'>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
