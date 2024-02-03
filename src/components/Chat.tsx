import { db } from './services/firebaseConfig'
const Chat = () => {
    const messages = Array.from({ length: 40 });
    const messagesRef = db.collection
  const renderMessages = () => {
    return messages.map((_, index) => (
      <div key={index} className="w-full h-20 bg-white mb-2"></div>
    ));
  };

    return (
        <div className="w-full h-auto h-min-screen overflow-y-scroll dark:bg-gray-950">
            <div className="p-2 flex flex-col">
                {renderMessages()}
            </div>
        </div>
    );
}

export default Chat;