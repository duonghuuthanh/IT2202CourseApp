import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home/Home";
import Lessons from "./components/Home/Lessons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { Icon } from "react-native-paper";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} options={{title:"Danh sách khóa học"}} />
      <Stack.Screen name="lessons" component={Lessons} options={{title: "Danh sách bài học"}} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="index" component={StackNavigator} options={{tabBarIcon: () => <Icon size={30} source="home" />}} />
      <Tab.Screen name="login" component={Login} options={{tabBarIcon: () => <Icon size={30} source="account" />}} />
      <Tab.Screen name="register" component={Register} options={{tabBarIcon: () => <Icon size={30} source="account-plus" />}} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App;