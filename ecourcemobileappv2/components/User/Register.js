import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import { use, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const info = [{
        label: 'Tên',
        field: 'first_name',
        secureTextEntry: false,
        icon: "text"
    }, {
        label: 'Họ và tên lót',
        field: 'last_name',
        secureTextEntry: false,
        icon: "text"
    }, {
        label: 'Tên đăng nhập',
        field: 'username',
        secureTextEntry: false,
        icon: "account"
    }, {
        label: 'Mật khẩu',
        field: 'password',
        secureTextEntry: true,
        icon: "eye"
    }, {
        label: 'Xác nhận mật khẩu',
        field: 'confirm',
        secureTextEntry: true,
        icon: "eye"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setState(result.assets[0], 'avatar');
        }
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

        if (user.password !== user.confirm) {
            setMsg('Mật khẩu không khớp!');
            return false;
        }

        setMsg("");
        return true;
    }

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                let form = new FormData();
                for (let key in user) {
                    if (key !== 'confirm') {
                        if (key === 'avatar') {
                            form.append('avatar', {
                                uri: user.avatar?.uri,
                                name: user.avatar?.fileName,
                                type: user.avatar?.type
                            });
                        } else
                            form.append(key, user[key]);
                    }
                }

                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    nav.navigate('login');
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

            {info.map(i => <TextInput key={`Register${i.field}`} value={user[i.field]} 
                                    onChangeText={t => setState(t, i.field)}
                                    label={i.label} style={MyStyles.m}
                                    secureTextEntry={i.secureTextEntry}
                                    right={<TextInput.Icon icon={i.icon} />} />)}

            <TouchableOpacity style={MyStyles.m} onPress={picker}>
                <Text>Chọn ảnh đại diện...</Text>
            </TouchableOpacity>

            {user?.avatar && <Image source={{uri: user.avatar.uri}} style={[MyStyles.avatar, MyStyles.m]} />}
            
            <Button disabled={loading} loading={loading} onPress={register} mode="contained" style={MyStyles.m}>Đăng ký</Button>
        </ScrollView>
    );
}

export default Register;