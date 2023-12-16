import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ref, onValue, remove } from 'firebase/database';
import { Button, ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useFirebase } from './FirebaseContext';
import Svg, { Path } from 'react-native-svg';

export default function TyoLista() {
  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigation = useNavigation();
  const firebaseContext = useFirebase(); // Firebase null testausta varten
  const initialDatabaseState = firebaseContext && firebaseContext.database ? firebaseContext.database : null;
  const [database, setDatabase] = useState(initialDatabaseState); // firebase database käyttöä varten
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if the database is null and set up a default state
    if (!database) {
      console.log('Firebase context or database is null.', firebaseContext);
      return;
    }
    const itemsRef = ref(database, 'data/');
    onValue(itemsRef, (snapshot) => {
      const info = snapshot.val();
      if (info) {
        const items = Object.keys(info).map((key) => ({
          id: key,
          ...info[key],
        }));
        setData([...items]);
        setFilteredData([...items]); // Initialize filteredData
        console.log('All items:', items);
      } else {
        console.log('No data in list.');
      }
      setLoading(false);
    },
    (error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [database]);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading indicator
  }

  const filterData = () => {
    let filtered = [...data]; // Copy of original list
    switch (selectedFilter) {
      case 'all':
        // No specific filter logic for 'all', so everything is visible normally
        break;
      case 'name':
        filtered = filtered.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
        break;
      case 'selectedOption':
        // Add  filter2 logic here
        filtered = filtered.filter(/* filter2 logic */);
        break;
        case 'selectedDate':
          // Add  filter3 logic here
          filtered = filtered.filter(/* filter2 logic */);
          break;
      default:
        console.log('invalid case selected for filtering')
        break;
    }
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order
    setFilteredData(filtered);
  };
  
  const filterOptions = [ // filtteri valinnat
    { label: 'All', value: 'all' },
    { label: 'Name', value: 'name' },
    { label: 'State', value: 'selectedOption' },
    { label: 'Date', value: 'selectedDate' },
  ];
  const deleteItem = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you wish to delete the item?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            remove(ref(database, `data/${id}`));
            setData((prevData) => prevData.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        containerStyle={{ backgroundColor: 'white' }}
        onLongPress={() => deleteItem(item.id)}
        onPress={() => navigation.navigate('MuokkaaTyötä', { Id: item.id })}>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         {/* Use the Svg and Path components from react-native-svg */}
         <Svg height="24" width="24" viewBox="0 0 24 24">
          <Path
            fill="#000000"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2V7h2v9z"
          />
        </Svg>
      </View>
      {/* Filter Picker */}
      <Picker style={{ height: 50, width: 200, backgroundColor: 'white' }}
        selectedValue={selectedFilter}
        onValueChange={(itemValue) => setSelectedFilter(itemValue)}>
        {filterOptions.map((option) => (
      <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
      <View style={styles.miniContainer}>
        {/* New item button */}
        <Button
          raised
          buttonStyle={{ backgroundColor: 'lightblue' }}
          title="Add New"
          onPress={() => navigation.navigate('UusiTyö')}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    padding: 5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniContainer: {
    width: 150,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    width: 150,
    color: 'blue',
    borderColor: 'gray',
    borderWidth: 1,
  },
});
