import { NavigationContainer } from '@react-navigation/native';
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import Kartta from './Components/Kartta'

const Tab = createNativeStackNavigator();


export default function App() {
  return (
<NavigationContainer>
  <Tab.Navigator>
    <Tab.Screen name="Kartta" component={Kartta} />
  </Tab.Navigator>
</NavigationContainer>
  );
};
