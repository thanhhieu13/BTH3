import React from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import { useSettings } from './SettingsContext';
import * as SQLite from 'expo-sqlite';
import Slider from '@react-native-community/slider';

const db = SQLite.openDatabase('settings.db');

const SettingsScreen = () => {
  const { state, dispatch } = useSettings();

  const toggleDarkMode = () => {
    const newDarkMode = !state.darkMode;
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    saveSettingsToDatabase({ darkMode: newDarkMode, fontSize: state.fontSize });
  };

  const updateFontSize = (value) => {
    const newFontSize = Math.round(value); // Làm tròn giá trị slider về số nguyên
    dispatch({ type: 'UPDATE_FONT_SIZE', payload: newFontSize });
    saveSettingsToDatabase({ darkMode: state.darkMode, fontSize: newFontSize });
  };

  const saveSettingsToDatabase = (settings) => {
    db.transaction(
      (tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, darkMode BOOLEAN, fontSize INTEGER);');
        tx.executeSql('INSERT OR REPLACE INTO settings (id, darkMode, fontSize) VALUES (1, ?, ?);', [settings.darkMode, settings.fontSize]);
      },
      (error) => console.log('Error saving settings to database:', error),
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: state.darkMode ? 'black' : 'white',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      margin: 20, // Khoảng cách giữa dòng và cột
    },
    text: {
      color: state.darkMode ? 'white' : 'black',
      fontSize: state.fontSize,
    },
    mode: {
      color: state.darkMode ? 'white' : 'black',
      fontSize: state.fontSize,
      textAlign: 'left', 
    },
    slider: {
      alignItems: 'center',
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch style={styles.mode} value={state.darkMode} onValueChange={toggleDarkMode} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Font Size: </Text>
        <Text style={styles.mode}>{state.fontSize} </Text>
      </View>
      <View style={styles.slider}>
        <Slider
          minimumValue={12}
          maximumValue={36}
          step={1} // Bước là 1 để slider làm tròn giá trị
          value={state.fontSize}
          onValueChange={updateFontSize}
          style={{ width: 300 }}
        />
      </View>

    </View>
  );
};

export default SettingsScreen;
