import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View, } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useState } from "react";
import { Chip, List, Searchbar } from "react-native-paper";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState();
    const [cateId, setCateId] = useState(null);
    const [page, setPage] = useState(1);
    const nav = useNavigation();

    const loadCates = async () => {
        let res = await Apis.get(endpoints['categories']);
        setCategories(res.data);
    }

    const loadCourses = async () => {
        if (page > 0) {
            let url = `${endpoints['courses']}?page=${page}`;

            if (q) {
                url = `${url}&q=${q}`
            }

            if (cateId) {
                url = `${url}&category_id=${cateId}`;
            }

            try {
                setLoading(true);
                let res = await Apis.get(url);
                setCourses([...courses, ...res.data.results]);

                if (res.data.next === null)
                    setPage(0);
            } catch {

            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        loadCates();
    }, []);

    useEffect(() => {
        let timer = setTimeout(() => {
            loadCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, cateId, page]);

    useEffect(() => {
        setPage(1);
        setCourses([]);
    }, [q, cateId]);

    const loadMore = () => {
        if (!loading && page > 0)
            setPage(page + 1);
    }

    return (
        <SafeAreaView style={[MyStyles.container, MyStyles.p]}>
            

            <View style={[MyStyles.row, MyStyles.wrap]}>
                <TouchableOpacity onPress={() => setCateId(null)}>
                    <Chip icon="label" style={MyStyles.m} >Tất cả</Chip>
                </TouchableOpacity>

                {categories.map(c => <TouchableOpacity key={`Cate${c.id}`} onPress={() => setCateId(c.id)}>
                    <Chip icon="label" style={MyStyles.m} >{c.name}</Chip>
                </TouchableOpacity>)}
            </View>

            <Searchbar placeholder="Tìm kiếm khóa học.." value={q} onChangeText={setQ} />

            <FlatList onEndReached={loadMore} ListFooterComponent={loading && <ActivityIndicator />} data={courses} 
                      renderItem={({item}) => <List.Item key={`Course${item.id}`} title={item.subject} 
                                                    description={item.created_date} 
                                                    left={() => <TouchableOpacity onPress={() => nav.navigate('lesson', {'courseId': item.id})}>
                                                        <Image style={MyStyles.avatar} source={{uri: item.image}} />
                                                    </TouchableOpacity>} />} />
        </SafeAreaView>
    );
}

export default Home;