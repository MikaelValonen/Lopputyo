import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput, Alert, Picker } from 'react-native';
import { useFirebase } from './FirebaseContext';
import { DatePicker } from 'react-native-datepicker';

export default function YksiTyo({ route }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [Nimi, setNimi] = useState('');
  const [Desc, setDesc] = useState('');
  const { database } = useFirebase();
  const { Id } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await database.ref(`/yourFirebaseNode/${Id}`).once('value');
        const item = snapshot.val();
        if (item) {
        setItemData(item);
        setSelectedOption(item.option);
        setSelectedDate(item.date);
        } else {
          Alert.alert('Item Not Found', 'The requested item does not exist.'); }
      } catch (error) {
        console.error('Error fetching item:', error);
        Alert.alert('Error', 'Failed to fetch the item. Please try again.');
      }
    };

    fetchData();
  }, [Id, database]);

  return (
    <View style={styles.container}>
      <TextInput type="text" name="Nimi" placeholder="Name" onChangeText={setNimi}  value={Nimi} />
      <TextInput type="text" name="Description" placeholder="Description" onChangeText={setDesc}  value={Desc}/>

      <Picker selectedValue={selectedOption}
        onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}> {/*picker 'tila' vaihtoehtoja varten */}
        
        <Picker.Item label="Done" value="Done" />
        <Picker.Item label="Ongoing" value="Ongoing" />
        <Picker.Item label="Hiatus" value="Hiatus" />
        <Picker.Item label="To-do" value="To-do" />
      </Picker>

      {/* Date picker päivämäärää varten */}
      <DatePicker
        style={{ width: 200 }}
        date={selectedDate}
        mode="date"
        placeholder="Select date"
        format="YYYY-MM-DD"
        onDateChange={(date) => setSelectedDate(date)}
      />
{/* Tallenna nappi */}
<Button 
  title="Save Changes"
  onPress={async () => {
    try {
      const dataToUpdate = {
        name: Nimi,
        description: Desc,
        option: selectedOption,
        date: selectedDate,
      };
      await database.ref(`/yourFirebaseNode/${Id}`).update(dataToUpdate);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update the item. Please try again.');
    }
  }}/>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  sidebar: {
    width: 250,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});
