// src/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {

    return false;

    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   return true;
    // }
    // // Fall back to saved preference or default to false
    // return localStorage.getItem('darkMode') === 'true' || false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);

    // Set initial theme
    setIsDarkMode(mediaQuery.matches);

    // Cleanup listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  //   if (isDarkMode) {
  //     document.body.classList.add('dark');
  //   } else {
  //     document.body.classList.remove('dark');
  //   }
  //   loadArcGISTheme(isDarkMode);
  // }, [isDarkMode]);

  const toggleDarkMode = () => {
    // setIsDarkMode(!isDarkMode);
    setIsDarkMode(false)
  };

  const loadArcGISTheme = (isDark) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = isDark
      ? 'https://js.arcgis.com/4.30/@arcgis/core/assets/esri/themes/dark/main.css'
      : 'https://js.arcgis.com/4.30/@arcgis/core/assets/esri/themes/light/main.css';
    
    // Remove any existing ArcGIS CSS
    const existingLink = document.querySelector('link[data-arcgis-theme]');
    if (existingLink) {
      existingLink.remove();
    }
    
    link.setAttribute('data-arcgis-theme', 'true');
    document.head.appendChild(link);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);