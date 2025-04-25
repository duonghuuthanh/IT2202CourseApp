import { useContext } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

    const logout = () => {
        dispatch({
            "type": "logout"
        });
        nav.navigate('index');
    }

    return (
        <View>
            <Text style={MyStyles.subject}>Chào {user.username}!</Text>
            <Button onPress={logout} mode="contained" style={MyStyles.m}>Đăng xuất</Button>
        </View>
    )
}

export default Profile;