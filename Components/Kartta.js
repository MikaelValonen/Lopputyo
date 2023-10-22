import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';

const myKey = 'JMU5h8bsP4SthjzoIN7jyKXiMewMoyje'

export default function App(osoite) {
  const [location, setLocation] = useState(null);
  const [etsittava, setEtsittava] = useState(osoite);
  const [tulos, setTulos] = useState('');
  const [lati, setLati] = useState(location?.coords.latitude || 0);
  const [long, setLong] = useState(location?.coords.longitude || 0);
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location');
        return null;
      } 
      try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(location);
      setLati(location.coords.latitude);
      setLong(location.coords.longitude);
      console.log('Location:', location);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);


  const buttonPressed = async () => {
    try {
      const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${myKey}&location=${etsittava}`);
      const result = await response.text();
      setTulos(result);
      const parsedResult = JSON.parse(result);
      const newLatitude = parseFloat(parsedResult.results[0].locations[0].displayLatLng.lat);
      const newLongitude = parseFloat(parsedResult.results[0].locations[0].displayLatLng.lng);
      setLati(newLatitude);
      setLong(newLongitude);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

const initial = {
  latitude: lati,
  longitude: long,
 // latitudeDelta: 0.0922,
 // longitudeDelta: 0.0421,

};

const coordinates = {
  latitude: parseFloat(lati),
  longitude: parseFloat(long)
};

  return (
    <View style={styles.container}>
      <Header leftComponent={icon={ name: 'menu', color: '#fff', onPress: () => navigation.navigate('Lista')}} centerComponent={{ text: 'MAP', color: '#fff' }}/>
      <MapView style={styles.map} region={initial}>
      <Marker coordinate={coordinates}  title= {etsittava} />
      </MapView>
      <Button title="Show" onPress={() => buttonPressed()} />
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
    width: "100%",
    height: "100%"
  },
  sidebar: {
    width: 250, // Adjust the width as needed
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});