import { useState, useEffect } from 'react';
import NavBar from './Navbar.tsx';
import Contats from './Contats.tsx';
import Chat from './Chat.tsx';
import Login from './Login.tsx';
import { auth } from './services/firebaseConfig.ts';

const Home = () => {
    const [user, setUser] = useState(auth.currentUser);
    const [isSelected, setIsSelected] = useState(1);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((newUser) => {
            setUser(newUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const backGroundOnClick = (select: number): void => {
        setIsSelected(select);
    }

    const handleMenus = ()=>{
        if(isSelected==1){
            return(<div className='flex flex-row w-full h-screen'><Chat /></div>)
        }
        else if (isSelected==2){
            return(<div className='flex flex-row w-full h-screen'><Contats /><Chat /></div>)
        }
        return(
            <div>nada aqui :3</div>
        );
    }
    return (
        <div className="flex flex-row">
            <NavBar backGroundOnClick={(param:number)=>backGroundOnClick(param)} isSelected={isSelected} />
            {user ? handleMenus() : <Login/> }

        </div>
    );
};

export default Home;
