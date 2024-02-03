import { useState, useEffect } from 'react';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import {  db } from './services/firebaseConfig';

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
  const { room, user } = props;
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = collection(db, 'globalMessages');

  useEffect(() => {
    const queryMessages = query(messageRef, where('room', '==', room));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ ...doc.data(), id: doc.id } as Message);
      });

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [room]);

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
      room: 1,
    });

    setNewMessage("");
  };

  return (
    <div className="w-full h-auto h-min-screen overflow-y-scroll dark:bg-gray-950">
      <div className="p-2 flex flex-col">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <form onSubmit={handleSubmit}>
          <input className='pl-2' type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button type="submit" className='p-3 bg-slate-300'>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
