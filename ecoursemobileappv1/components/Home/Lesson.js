import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useState } from "react";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../configs/Apis";

const Lesson = ({route}) => {
    const courseId = route.params?.courseId;
    const [loading, setLoading] = useState(false);
    const [lessons, setLessons] = useState([]);
    const nav = useNavigation();

    const loadLessons = async () => {
        try {
            setLoading(true);
            
            let res = await Apis.get(endpoints['lessons'](courseId));
            console.info(res.data)
            setLessons(res.data);
            console.info(res.data)
        } catch(ex) {
            console.error(ex);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLessons();
    }, [courseId]);

    return (
        <View>
            <Text style={MyStyles.subject}>DANH SÁCH BÀI HỌC</Text>
            <FlatList  ListFooterComponent={loading && <ActivityIndicator />} 
                       data={lessons} renderItem={({ item }) => <List.Item title={item.subject} description={item.created_date} 
                                                                                      left={() => <TouchableOpacity onPress={() => nav.navigate('lesson-details', {lessonId: item.id})}><Image style={MyStyles.avatar} source={{uri: item.image}} /></TouchableOpacity>} />} />
        </View>
    );
}

export default Lesson;