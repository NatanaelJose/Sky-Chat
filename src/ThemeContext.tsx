import { createContext, useContext, useState, useEffect } from "react";


interface ThemeContextType {
    darkMode: boolean;
    toggleTheme: () => void;
  }
  
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
  
export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }:any) => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const [darkMode, setDarkMode] = useState(prefersDarkMode);


  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add("dark");
      htmlElement.style.backgroundColor = "#111827";
      htmlElement.style.setProperty('--scrollbar-thumb-color', 'var(--scrollbar-thumb-color-dark)');
      htmlElement.style.setProperty('--scrollbar-track-color', 'var(--scrollbar-track-color-dark)');
    } else {
      htmlElement.classList.remove("dark");
      htmlElement.style.backgroundColor = "#e2e8f0";
      htmlElement.style.setProperty('--scrollbar-thumb-color', 'var(--scrollbar-thumb-color-light)');
      htmlElement.style.setProperty('--scrollbar-track-color', 'var(--scrollbar-track-color-light)');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const contextValue = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};