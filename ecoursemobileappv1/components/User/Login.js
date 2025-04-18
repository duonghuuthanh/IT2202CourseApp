import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { useContext, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/MyContexts";

const Register = () => {
    const info = [{
        label: "Tên đăng nhập",
        field: "username",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Mật khẩu",
        field: "password",
        secureTextEntry: true,
        icon: "eye"
    }];

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }


    const validate = () => {
        for (let i of info)
            if (!(i.field in user)  || user[i.field] === '') {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }


        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                let res = await Apis.post(endpoints['login'], {
                    ...user,
                    'client_id': 'Vbe8euZZQJoWJ2UzW9wDThg4hJEZHHbhFmnfj7UR',
                    'client_secret': 'cVm4w4hSdy4MtwbP4KuNgXkGPeQJ9yrQdBvXHGR6b3e97F2bYqQ81XJ49FEufzjcw4SKwpuOZQiCLsNelHY1MkuYTGBRcSqtWmSlebSUk27WfyDskCB2VeCQihnEKdZ2',
                    'grant_type': 'password'
                });
                await AsyncStorage.setItem('token', res.data.access_token);

                let u = await authApis(res.data.access_token).get(endpoints['current-user']);
               
                dispatch({
                    "type": "login",
                    "payload": u.data
                });
                nav.navigate("home");
            } catch(ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView>
            <HelperText style={MyStyles.m} type="error" visible={msg}>
                {msg}
            </HelperText>
            {info.map(i => <TextInput value={user[i.field]} 
                                        onChangeText={t => setState(t, i.field)} 
                                        style={MyStyles.m} key={`${i.label}${i.field}`} 
                                        label={i.label} secureTextEntry={i.secureTextEntry} 
                                        right={<TextInput.Icon icon={i.icon} />}/>)}

            <Button onPress={login} disabled={loading} loading={loading} mode="contained" style={MyStyles.m}>Đăng nhập</Button>
        </ScrollView>
    );
}

export default Register;