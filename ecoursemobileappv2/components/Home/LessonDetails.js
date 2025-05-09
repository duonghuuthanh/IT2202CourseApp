import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Button, Card, List, TextInput } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import MyStyles from "../../styles/MyStyles";
import { Image } from "react-native";
import moment from "moment";
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LessonDetails = ({ route }) => {
    const [lesson, setLesson] = useState(null);
    const [comments, setComments] = useState([]);
    const lessonId = route.params?.lessonId;
    const user = useContext(MyUserContext);
    const [content, setContent] = useState();
    const [loading, setLoading] = useState(false);

    const loadLesson = async () => {
        let res = await Apis.get(endpoints['lesson-details'](lessonId));
        setLesson(res.data);
    }

    const loadComments = async () => {
        let res = await Apis.get(endpoints['comments'](lessonId));
        setComments(res.data);
    }

    const addComment = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApis(token).post(endpoints['comments'](lessonId), {
                content: content
            });
            setComments([res.data, ...comments]);
            setContent("");
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.info(Math.random());
        loadLesson();
        loadComments();
    }, [lessonId]);

    return (
        <ScrollView>
            {lesson === null ? <ActivityIndicator /> : <>
                <Card>
                    <Card.Title subtitle={lesson.subject} />
                    <Card.Cover source={{ uri: lesson.image }} />
                    <Card.Content>
                        <RenderHTML source={{ html: lesson.content }} />
                    </Card.Content>


                </Card>
            </>}

            {user && <View style={MyStyles.p}>

                <TextInput mode="outlined"
                    label="Bình luận" value={content} onChangeText={setContent}
                    placeholder="Nội dung bình luận..." />
                <Button onPress={addComment} disabled={loading} loading={loading} style={MyStyles.m} mode="contained">Thêm bình luận</Button>
            </View>}


            <View>
                {comments.map(c => <List.Item title={c.content} description={moment(c.created_date).fromNow()} left={() => <Image style={MyStyles.avatar} source={{ uri: c.user.image }} />} />)}
            </View>
        </ScrollView>
    );
}

export default LessonDetails;