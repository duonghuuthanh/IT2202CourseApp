import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home/Home";
import Lessons from "./components/Home/Lessons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { Icon } from "react-native-paper";
import LessonDetails from "./components/Home/LessonDetails";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import { useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Profile from "./components/User/Profile";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} options={{title:"Danh sách khóa học"}} />
      <Stack.Screen name="lessons" component={Lessons} options={{title: "Danh sách bài học"}} />
      <Stack.Screen name="lesson-details" component={LessonDetails} options={{title: "Chi tiết bài học"}} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="index" component={StackNavigator} options={{title: "Khóa học", headerShown:false, tabBarIcon: () => <Icon size={30} source="home" />}} />

      {user === null?<>
        <Tab.Screen name="login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon size={30} source="account" />}} />
        <Tab.Screen name="register" component={Register} options={{title: "Đăng ký", tabBarIcon: () => <Icon size={30} source="account-plus" />}} />
      </>:<>
      <Tab.Screen name="profile" component={Profile} options={{title: "Tài khoản", tabBarIcon: () => <Icon size={30} source="account-plus" />}} />
      </>}
      
      
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
    
  );
}

export default App;