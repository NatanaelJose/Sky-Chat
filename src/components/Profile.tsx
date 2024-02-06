import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from 'react';
import { signOutGoogleAccount } from "./services/firebaseConfig";

export const ProfilePic = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };

    const isMounted = menuRef.current;
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (isMounted) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-1/2 flex justify-center items-end mb-4">
      <div onClick={toggleMenu} className="text-white p-3 rounded-full h-12 w-12 bg-gray-700 transition-transform duration-300 transform hover:scale-105 flex items-center justify-center cursor-pointer relative z-10">
        <FontAwesomeIcon icon="user" className="text-3xl" />
      </div>
      {menuVisible && (
        <div ref={menuRef} className="absolute bottom-5 mt-1 py-1 w-max dark:text-white dark:bg-gray-700 border border-blue-500 rounded-lg shadow-2xl z-20">
          <div onClick={() => { setMenuVisible(false); signOutGoogleAccount(); }} className="block px-4 py-2 w-24 dark:text-white hover:bg-gray-900 cursor-pointer">Sair</div>
        </div>
      )}
    </div>
  );
};
