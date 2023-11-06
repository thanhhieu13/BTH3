import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from './SettingsContext'; // Import the useSettings hook

const db = SQLite.openDatabase('notes.db');

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const { navigate } = useNavigation();
  const { state: settingsState } = useSettings(); // Retrieve settings state

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshNotes();
    });
    return unsubscribe;
  }, [navigation]);

  const refreshNotes = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM notes;', [], (_, { rows }) => {
        const sortedNotes = rows._array.sort((a, b) => b.id - a.id);
        setNotes(sortedNotes);
      });
    });
  };

  const deleteNote = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql('DELETE FROM notes WHERE id = ?;', [id]);
      },
      null,
      () => {
        refreshNotes();
      }
    );
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Edit Note', { note: item });
      }}
    >
      <View style={[styles.note, { backgroundColor: settingsState.darkMode ? 'black' : '#f5f4f2' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[styles.noteTitle, { color: settingsState.darkMode ? 'white' : 'black', fontSize: settingsState.fontSize }]}>
            {item.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteNote(item.id);
            }}
          >
            <Image source={require('../img/delete.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <Text style={{ color: settingsState.darkMode ? 'white' : 'black', fontSize: settingsState.fontSize }}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: settingsState.darkMode ? 'black' : '#f5f4f2' }]}>
      <Text style={[styles.header, { color: settingsState.darkMode ? 'white' : 'gray' }]}>
        All Notes
      </Text>
      <FlatList data={notes} renderItem={renderNote} keyExtractor={(item) => item.id.toString()} />
      <TouchableOpacity onPress={() => navigate('AddNote')} style={styles.addButton}>
        <Image source={require('../img/add.png')} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  note: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addButton: {
    borderRadius: 20,
    position: 'absolute',
    right: 25,
    top: 10,
    width: 40,
    height: 40,
  },
});