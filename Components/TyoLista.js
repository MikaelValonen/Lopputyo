import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ref, onValue, remove, get } from 'firebase/database';
import { Button, ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useFirebase } from './FirebaseContext';


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

  const filterData = () => {
    console.log('Filtering data...');
    let filtered = [...data]; // Copy of original list
    console.log('Filter:', filtered);
    switch (selectedFilter) {
      case 'all': // no logic at all
        break;
      case 'name': //filter based on name
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;       
      case 'selectedOption': //order based on selected Option, 'Done' come last, other sort normally
      filtered = filtered.sort((a, b) => {
        if (a.option === 'Done' && b.option !== 'Done') {
          return 1; // 'Done' items come last
        } else if (a.option !== 'Done' && b.option === 'Done') {
          return -1; 
        } else {
          // For non-'Done' items, sort by name
          return a.name.localeCompare(b.name);
        }
      });
      break;
      case 'selectedDate': //Order by date
  filtered = filtered.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : null;
    const dateB = b.date ? new Date(b.date) : null;

    // Handle undefined or null dates
    if (!dateA && !dateB) {
      return 0; // If both dates are undefined or null, consider them equal
    } else if (!dateA) {
      return -1; // If dateA is undefined or null, consider it smaller
    } else if (!dateB) {
      return 1; // If dateB is undefined or null, consider it smaller
    }

    // Compare dates
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  });
  break;
      default:
        console.log('invalid case selected for filtering')
        break;
    }
    setFilteredData(filtered);
  };

  const fetchData = async () => {
    try {
      if (!database) {
        console.log('Firebase context or database is null.', firebaseContext);
        return;
      }
  
      const itemsRef = ref(database, 'data/');
      const snapshot = await get(itemsRef);
  
      if (!snapshot.exists()) {
        console.log('No data in list.');
        setData([]);
        setFilteredData([]);
        setLoading(false);
        return;
      }
  
      const info = snapshot.val();
  
      if (info !== null) {
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
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
      setLoading(false);
    }
  };

  const addNew = (newItem) => {
    // Update the data state
    setData((prevData) => [...prevData, newItem]);
    // Update the filteredData state
    setFilteredData((prevFilteredData) => [...prevFilteredData, newItem]);
  };
  
  useEffect(() => {
    fetchData();
  }, [database]);

  useEffect(() => {
    filterData();
  }, [selectedFilter, data]);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading indicator
  }
  
  
  
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
        
        <ListItem.Title>{`${item.name} - ${item.option} - ${item.date}`}</ListItem.Title>
        
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
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
          onPress={() => navigation.navigate('UusiTyö', { addNew: addNew })}
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
