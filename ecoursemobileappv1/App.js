import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Home/Home";
import Login from "./components/User/Login";
import { Icon } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Lesson from "./components/Home/Lesson";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Tab.Screen name="home" component={Home} options={{title: 'Khóa học'}} />
      <Tab.Screen name="lesson" component={Lesson} options={{title: 'Bài học'}} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="home" component={StackNavigator} options={{tabBarIcon: () => <Icon size={30} source="home" />}} />
      <Tab.Screen name="login" component={Login} options={{title: 'Đăng nhập', tabBarIcon: () => <Icon size={30} source="account" />}} />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App;