import { useTheme } from "../ThemeContext";
import NavBar from "./Navbar";

interface ThemeContextType {
    darkMode: boolean;
    toggleTheme: () => void;
  }
  
const HandleTheme = () => {
  const { darkMode, toggleTheme }: ThemeContextType = useTheme() || { darkMode: false, toggleTheme: () => {} };

  return (
    <div>
      <button className="bg-sky-500 text-white p-2 rounded-3xl" onClick={toggleTheme}>{darkMode ? 'Modo Escuro' : "Modo Claro"}</button>
    </div>
  );
};

const Config = () => {
    return(
        <div className="flex flex-row">
            <NavBar isSelected={3} />
            <div className="w-full h-screen flex flex-col items-center dark:bg-gray-950  bg-gray-200">
                <div className="w-[96%] h-20 flex flex-row items-center mt-5 p-2 rounded-2xl">
                  <p className="mr-3 dark:text-white">Trocar de tema: </p>
                  <HandleTheme/>

                </div>
            </div>
        </div>
    )
}

export default Config;
