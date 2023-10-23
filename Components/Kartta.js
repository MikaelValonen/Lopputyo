import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';

const myKey = 'JMU5h8bsP4SthjzoIN7jyKXiMewMoyje'

export default function App(osoite) {
  const [location, setLocation] = useState(null);
  const [etsittava, setEtsittava] = useState(osoite.route.params);
  const [tulos, setTulos] = useState('');
  const [lati, setLati] = useState(0);
  const [long, setLong] = useState(0);
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
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
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  
  const buttonPressed = async () => {
    try {
      console.log('etsittava: ', etsittava)
      console.log('Osoite:',osoite)
      const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${myKey}&location=${etsittava}`);
      const result = await response.text();
      setTulos(result);
      const parsedResult = JSON.parse(result);
      const newLatitude = parseFloat(parsedResult.results[0].locations[0].displayLatLng.lat);
      const newLongitude = parseFloat(parsedResult.results[0].locations[0].displayLatLng.lng);

      console.log('newLatitude:', newLatitude);
      console.log('newLongitude:', newLongitude);

      setLati(newLatitude);
      setLong(newLongitude);
      setMapRegion({
        latitude: newLatitude,
        longitude: newLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  


const coordinates = {
  latitude: parseFloat(lati),
  longitude: parseFloat(long)
};

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
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