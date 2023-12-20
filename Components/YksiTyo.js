import React, { useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { push, ref as sRef, get, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useFirebase } from './FirebaseContext';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';


export default function YksiTyo({ route }) {
  console.log("params: ",route.params)
  const { Id } = route.params;
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Done');
  const [selectedDate, setSelectedDate] = useState(new Date('2023-01-01'));
  const [Nimi, setNimi] = useState('');
  const [Desc, setDesc] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { database } = useFirebase();
console.log('Firebase Database Object:', database);
  const navigation = useNavigation();

  useEffect(() => {
    if (!database) {
      console.log('Firebase context or database is null.');
      return;
    }
  }, [database]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Id && database) {
          const itemRef = sRef(database, `data/${Id}`);
          const snapshot = await get(itemRef);

          if (snapshot.exists()) {
            const { name, description, option, date } = snapshot.val();
            setNimi(name);
            setDesc(description);
            setSelectedOption(option);
            setSelectedDate(new Date(date));
          }
        }
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Id, database])

  const updateItem = () => {
    const newItem = {
      name: Nimi,
      description: Desc,
      option: selectedOption,
      date: selectedDate.toISOString().split('T')[0],
    };
    const itemsRef = sRef(database, 'data');
  
    if (Id) {
      // If Id exists, it means we are editing an existing item
      const itemRefToUpdate = sRef(itemsRef, Id);
      update(itemRefToUpdate, newItem); //set to update an existing item
    } else {
      push(itemsRef, newItem); //push to add a new item
    }
  
    setDesc('');
    setSelectedOption('Done');
    setSelectedDate(new Date('2023-01-01'));
    navigation.goBack();
  };

  const handleDatePress = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  useEffect(() => {
    return () => {
      // Reset showDatePicker when the component unmounts
      setShowDatePicker(false);
    };
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading indicator
  }

  return (
    <View style={styles.container}>
      <TextInput type="text" name="Nimi" placeholder="Name" onChangeText={setNimi} value={Nimi} />
      <TextInput type="text" name="Description" placeholder="Description" onChangeText={setDesc} value={Desc} />

      <Picker selectedValue={selectedOption} onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}>
        <Picker.Item label="Done" value="Done" />
        <Picker.Item label="Ongoing" value="Ongoing" />
        <Picker.Item label="Hiatus" value="Hiatus" />
        <Picker.Item label="To-do" value="To-do" />
      </Picker>

      <TouchableOpacity onPress={handleDatePress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 16 }}>Selected Date: {selectedDate.toISOString().split('T')[0]}</Text>
          <Icon name="calendar" size={30} style={{ margin: 15 }} />
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
          onDateChange={handleDateChange}
        />
      )}

      <Button title="päivitä" onPress={updateItem} />
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