import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { useEffect, useState } from "react";
import { Card } from "react-native-paper";
import RenderHTML from "react-native-render-html";

const LessonDetails = ({ route }) => {
    const [lesson, setLesson] = useState(null);
    const lessonId = route.params?.lessonId;
    console.info(lessonId)

    const loadLesson = async () => {
        let res = await Apis.get(endpoints['lesson-details'](lessonId));
        setLesson(res.data);
    }

    useEffect(() => {
        loadLesson();
    }, [lessonId]);

    return (
        <ScrollView>
            {lesson === null ? <ActivityIndicator />:<>
                <Card>
                    <Card.Title title={lesson.subject}  />
                    <Card.Cover source={{ uri: lesson.image }} />
                    <Card.Content>
                        
                        
                        <RenderHTML source={{html: lesson.content}} />
                    </Card.Content>
                </Card>
            </>}
        </ScrollView>
    );
}

export default LessonDetails;