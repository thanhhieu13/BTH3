// SettingsContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('settings.db');

const SettingsContext = createContext();

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'UPDATE_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    default:
      return state;
  }
};

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    darkMode: false,
    fontSize: 16,
  });

  const loadSettingsFromDatabase = () => {
    db.transaction(
      (tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, darkMode BOOLEAN, fontSize INTEGER);');
        tx.executeSql('SELECT * FROM settings WHERE id = 1;', [], (_, { rows }) => {
          if (rows.length > 0) {
            const { darkMode, fontSize } = rows._array[0];
            dispatch({ type: 'TOGGLE_DARK_MODE', payload: darkMode });
            dispatch({ type: 'UPDATE_FONT_SIZE', payload: fontSize });
          } else {
            // Nếu không có dữ liệu, mặc định là chế độ sáng và kích thước phông chữ 16 (hoặc giá trị mặc định của bạn).
            dispatch({ type: 'TOGGLE_DARK_MODE', payload: false });
            dispatch({ type: 'UPDATE_FONT_SIZE', payload: 16 });
          }
        });
      },
      (error) => console.log('Error loading settings from database:', error),
    );
  };
  

  useEffect(() => {
    loadSettingsFromDatabase();
  }, []);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};
