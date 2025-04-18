import { useContext } from "react";
import { Text, View } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContexts";
import { Button } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();
    
    const logout = () => {
        dispatch({
            "type": "logout"
        });
        nav.navigate("home");
    }

    return (
        <View>
            <Text style={MyStyles.subject}>Chào {user._j?.first_name} {user._j?.last_name}!</Text>
            <Button mode="contained" onPress={logout}>Đăng xuất</Button>
        </View>
    );
}

export default Profile; 