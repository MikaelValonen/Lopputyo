import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { Icon, Input, Button, ListItem } from 'react-native-elements'; 
import { useNavigation } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: "AIzaSyDB7N4G_idZpoVBsqf_61kuZXayXLXN0F4",
  authDomain: "karttadatabase.firebaseapp.com",
  databaseURL: "https://karttadatabase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "karttadatabase",
  storageBucket: "karttadatabase.appspot.com",
  messagingSenderId: "254763753775",
  appId: "1:254763753775:web:55ebce9f8ff98394b541da",
  measurementId: "G-J5GTMM255K"
};
export default function Ostoslista() {
  const [osoite, setOsoite] = useState('');
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
 
  const saveItem = () => {
    const newItemRef = ref(database, 'data/');
    const newItem = {
        osoite: osoite,
    };
    push(newItemRef, newItem);
    setOsoite('');
  };
      
  useEffect(() => {
    const itemsRef = ref(database, 'data/');
    onValue(itemsRef, (snapshot) => {
      const info = snapshot.val();
      if (info) {
        const items = Object.keys(info).map((key) => ({
          id: key,
          ...info[key],
        }));
        console.log('Fetched items:', items);
        setData([{ id: 'test', osoite: 'Jäkäläkuja 7' }, ...items]);
      } else {
        setData([]);
      }
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }, []);
  
    const deleteItem = (id) => {
      remove(ref(database, `data/${id}`));
    };
    const renderItem = ({ item }) => {
      console.log('Fetched item:', item);
      return (
        <ListItem bottomDivider containerStyle={{ backgroundColor: 'white'}}>
          <ListItem.Content onLongPress={() => deleteItem(item.id)} onPress={() => navigation.navigate('Lista', osoite)}>
            <ListItem.Title>{item.osoite}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      );
    };
    console.log('Data:', data);
    return (
      <View style={styles.container}>
        <Input  placeholder='Type in address'  label='PLACEFINDER'  onChangeText={setOsoite}  value={osoite}/>
        <View style={styles.miniContainer}>
        <Button raised icon={{ name: 'save' }} buttonStyle={{ backgroundColor: 'lightblue' }}  title="SAVE"  onPress={saveItem}  />
        </View>
        <View style={styles.container}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} // data ei näy ollenkaan, index ei toimi myöskään
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