import { useState, useEffect } from 'react';
import NavBar from './Navbar.tsx';
import Contats from './Contats.tsx';
import Chat from './Chat.tsx';
import Login from './Login.tsx';
import { auth } from './services/firebaseConfig.ts';

const Home = () => {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((newUser) => {
            setUser(newUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="flex flex-row">
            <NavBar />
            {user ? <div className='flex flex-row w-full h-screen'><Contats /><Chat /></div> : <Login/> }

        </div>
    );
};

export default Home;
