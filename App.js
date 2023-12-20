import { NavigationContainer } from '@react-navigation/native';
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { FirebaseProvider } from './Components/FirebaseContext';
import React from 'react';
import YksiTyo from './Components/YksiTyo'
import UusiTyo from './Components/UusiTyo'
import Kalenteri from './Components/Kalenteri'
import TyoLista from './Components/TyoLista'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
  <FirebaseProvider>
  <NavigationContainer>
  <Stack.Navigator>
  <Stack.Screen name="Työlista" component={TyoLista}  options={({ navigation }) => ({
              title: 'Työlista',
              headerRight: () => (
                <Icon
                  name="calendar"
                  size={24}
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate('Kalenteri')}
                />
              ),
            })} />
  <Stack.Screen name="MuokkaaTyötä"  component={YksiTyo} />
  <Stack.Screen name="Kalenteri" component={Kalenteri} options={({ navigation }) => ({
              title: 'Uusi Työ',
              headerRight: () => (
                <Icon
                  name="plus"
                  size={24}
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate('UusiTyö')}
                />
              ),
            })}
          />
  <Stack.Screen name="UusiTyö"  component={UusiTyo}/>  
  </Stack.Navigator>
  </NavigationContainer>
  </FirebaseProvider>
  );
};
