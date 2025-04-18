import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { Card } from "react-native-paper";
import RenderHTML from "react-native-render-html";

const LessonDetails = ({route}) => {
    const lessonId = route.params?.lessonId;
    const [lesson, setLesson] = useState(null);

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
                    <Card.Title title={lesson.subject} subtitle={lesson.created_date} />
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