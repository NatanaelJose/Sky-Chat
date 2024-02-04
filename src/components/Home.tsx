import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login.tsx';
import { auth } from './services/firebaseConfig.ts';

const Home = () => {
    const [user, setUser] = useState(auth.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((newUser) => {
            setUser(newUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        setUser(auth.currentUser);
    }, [auth.currentUser]);

    useEffect(() => {
        if (user) {
            navigate("/global");
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-row">
            <Login />
        </div>
    );
};

export default Home;
