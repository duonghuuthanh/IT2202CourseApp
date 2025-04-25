import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import { use, useContext, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/Contexts";

const Login = () => {
    const info = [{
        label: 'Tên đăng nhập',
        field: 'username',
        secureTextEntry: false,
        icon: "account"
    }, {
        label: 'Mật khẩu',
        field: 'password',
        secureTextEntry: true,
        icon: "eye"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }


    const validate = () => {
        if (Object.values(user).length === 0) {
            setMsg("Vui lòng nhập thông tin!");
            return false;
        }

        for (let i of info)
            if (user[i.field] === '') {
                setMsg(`Vui lòng nhập ${i.label}`);
                return false;
            }
       
        setMsg("");
        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                let res = await Apis.post(endpoints['login'], {
                    ...user,
                    client_id: "Vbe8euZZQJoWJ2UzW9wDThg4hJEZHHbhFmnfj7UR",
                    client_secret: "cVm4w4hSdy4MtwbP4KuNgXkGPeQJ9yrQdBvXHGR6b3e97F2bYqQ81XJ49FEufzjcw4SKwpuOZQiCLsNelHY1MkuYTGBRcSqtWmSlebSUk27WfyDskCB2VeCQihnEKdZ2",
                    grant_type: "password"
                });
                await AsyncStorage.setItem('token', res.data.access_token);

                let u = await authApis(res.data.access_token).get(endpoints['current-user']);
                console.info(u.data);

                dispatch({
                    "type": "login",
                    "payload": u.data
                });
                nav.navigate('index');
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={MyStyles.p}>
            <HelperText type="error" visible={msg}>{msg}</HelperText>

            {info.map(i => <TextInput key={`Login${i.field}`} value={user[i.field]} 
                                    onChangeText={t => setState(t, i.field)}
                                    label={i.label} style={MyStyles.m}
                                    secureTextEntry={i.secureTextEntry}
                                    right={<TextInput.Icon icon={i.icon} />} />)}
            
            <Button disabled={loading} loading={loading} onPress={login} mode="contained" style={MyStyles.m}>Đăng nhập</Button>
        </ScrollView>
    );
}

export default Login;