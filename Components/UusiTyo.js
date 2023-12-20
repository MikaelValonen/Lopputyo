import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { push, ref } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useFirebase } from './FirebaseContext';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';

export default function UusiTyo({ route }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [Nimi, setNimi] = useState('');
  const [Desc, setDesc] = useState('');
  const [selectedOption, setSelectedOption] = useState('Done');
  const [selectedDate, setSelectedDate] = useState(new Date('2023-01-01'));
  const { database } = useFirebase() || { database: null };
  const navigation = useNavigation();
  const { addNew } = route.params;

  useEffect(() => { // check if null, to avoid bugs
    if (!database) {
      console.log('Firebase context or database is null.');
      return;
    }}, [database]);
    
  const addNewItem = () => {
    const newItem = {
      name: Nimi,
      description: Desc,
      option: selectedOption,
      date: selectedDate.toISOString().split('T')[0],
    };

    const itemsRef = ref(database, 'data');
    push(itemsRef, newItem);
    addNew(newItem);

    setDesc('');
    setSelectedOption('Done');
    setSelectedDate(new Date('2023-01-01'));
    navigation.goBack();
  };
  
  const handleDatePress = () => {
    setShowDatePicker(!showDatePicker);
  };
  

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(new Date(date));
    }
    setShowDatePicker(false);
  };
  useEffect(() => {
    return () => {
      // Reset showDatePicker when component unmounts
      setShowDatePicker(false);
    };
  }, []);
  return (
      <View style={styles.container}>
      <TextInput type="text" name="Nimi" placeholder="Name" onChangeText={setNimi}  value={Nimi} />
      <TextInput type="text" name="Description" placeholder="Description" onChangeText={setDesc}  value={Desc} />

      <Picker selectedValue={selectedOption} onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}>
        <Picker.Item label="Done" value="Done" />
        <Picker.Item label="Ongoing" value="Ongoing" />
        <Picker.Item label="Hiatus" value="Hiatus" />
        <Picker.Item label="To-do" value="To-do" />
      </Picker>


      <TouchableOpacity onPress={handleDatePress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 16 }}>Selected Date: {selectedDate.toISOString().split('T')[0]}</Text>
          <Icon name="calendar"  size={30}  style={{ margin: 15 }}/>
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <DatePicker
          value={selectedDate}
          style={{ width: 300 }}
          date={selectedDate}
          mode="date"
          placeholder="Select date"
          format="YYYY-MM-DD"
          onChange={(event, date) => handleDateChange(event, date)}
        />
      )}

      <Button title="Add Item" onPress={addNewItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
