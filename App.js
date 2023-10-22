import { NavigationContainer } from '@react-navigation/native';
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import Kartta from './Components/Kartta'
import Lista from './Components/Lista'
import {Icon} from 'react-native-elements';
const Stack = createNativeStackNavigator();


export default function App() {
  return (
<NavigationContainer>
  <Stack.Navigator>
  <Stack.Screen name="My Places" component={Lista}  />
  <Stack.Screen name="Kartta"  component={Kartta}
          options={({ navigation }) => ({
            title: 'Map',
            headerLeft: () => (
              <Icon
                name="list"
                size={24}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('My Places')}
              />
            ),
          })}
        />
    
  </Stack.Navigator>
  
</NavigationContainer>
  );
};
