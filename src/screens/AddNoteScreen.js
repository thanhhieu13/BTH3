import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useSettings } from './SettingsContext'; // Import the useSettings hook

const db = SQLite.openDatabase('notes.db');

export default function AddNoteScreen({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const { state: settingsState } = useSettings(); // Retrieve settings state

  useEffect(() => {
    if (route.params && route.params.note) {
      const { note } = route.params;
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    }
  }, [route.params]);

  const addNote = () => {
    if (title.trim() === '') {
      // Validate if title is empty
      alert('Please enter a title');
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql('INSERT INTO notes (title, content) values (?, ?);', [title, content]);
      },
      null,
      () => {
        setTitle('');
        setContent('');
        navigation.goBack();
      }
    );
  };

  const updateNote = () => {
    if (title.trim() === '') {
      // Validate if title is empty
      alert('Please enter a title');
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql('UPDATE notes SET title = ?, content = ? WHERE id = ?;', [title, content, editingNote.id]);
      },
      null,
      () => {
        setTitle('');
        setContent('');
        setEditingNote(null);
        navigation.goBack();
      }
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: settingsState.darkMode ? 'black' : '#fff' }]}>
      <TextInput
        style={[styles.input, { backgroundColor: settingsState.darkMode ? 'gray' : 'transparent', color: settingsState.darkMode ? 'white' : 'black', fontSize: settingsState.fontSize }]}
        placeholder="Enter your title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { backgroundColor: settingsState.darkMode ? 'gray' : 'transparent', color: settingsState.darkMode ? 'white' : 'black', fontSize: settingsState.fontSize, height: 150, }]}
        placeholder="Enter your note"
        value={content}
        onChangeText={setContent}
      />
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={goBack}>
          <Image source={require('../img/remove.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={editingNote ? updateNote : addNote}>
          <Image
            source={editingNote ? require('../img/pen.png') : require('../img/check.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonImage: {
    width: 50,
    height: 50,
    margin: 10,
  },
});
