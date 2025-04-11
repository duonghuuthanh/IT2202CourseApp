import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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
    const [page, setPage] = useState(1);
    const [cateId, setCateId] = useState(null);
    const nav = useNavigation();

    const loadCates = async () => {
        let res = await Apis.get(endpoints['categories']);
        setCategories(res.data);
    }

    const loadCourses = async () => {
        if (page > 0) {
            try {
                setLoading(true);
    
                let url = `${endpoints['courses']}?page=${page}`;
    
                if (q) {
                    url = `${url}&q=${q}`;
                }
    
                if (cateId) {
                    url = `${url}&category_id=${cateId}`;
                }
    
                console.info(url);
                let res = await Apis.get(url);
                setCourses([...courses, ...res.data.results]);
    
                if (res.data.next === null)
                    setPage(0);
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            loadCates();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        loadCourses();
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
        <View style={[MyStyles.container, MyStyles.p]}>
            
            <View style={[MyStyles.row, MyStyles.wrap]}>
                <TouchableOpacity onPress={() => setCateId(null)}>
                    <Chip style={MyStyles.m} icon="label" >Tất cả</Chip>
                </TouchableOpacity>
                {categories.map(c => <TouchableOpacity key={`Cate${c.id}`} onPress={() => setCateId(c.id)}>
                    <Chip style={MyStyles.m} icon="label" >{c.name}</Chip>
                </TouchableOpacity>)}
            </View>

            <Searchbar placeholder="Tìm khóa học..." value={q} onChangeText={setQ} />

            <FlatList onEndReached={loadMore} ListFooterComponent={loading && <ActivityIndicator size={30} />} 
                    data={courses} renderItem={({item}) => <List.Item key={`Course${item.id}`} title={item.subject} description={item.created_date} 
                                    left={() => <TouchableOpacity onPress={() => nav.navigate('lessons', {'courseId': item.id})}>
                                        <Image style={MyStyles.avatar} source={{uri: item.image}} />
                                    </TouchableOpacity>} />} />
        </View>
    );
}

export default Home;