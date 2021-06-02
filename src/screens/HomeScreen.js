import React, {useState, useRef} from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
    RefreshControl, Image
} from "react-native";
import {Colors} from "../helpers/Colors";
import Toast from "../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import {Texts} from "../helpers/Texts";
import useAuth from "../hooks/Auth";
import {useDispatch, useSelector} from "react-redux";
import StudentList from "../components/StudentList";
import Loading from "../components/Loading";
import GeneralStatusBarColor from "../components/StatusBarColor";
import * as Sentry from "@sentry/react-native";
import Field from "../components/Field";
import {Badge} from "react-native-paper";
import AntIcon from "react-native-vector-icons/AntDesign";

const screenHeight = Math.round(Dimensions.get("window").height);

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const screenWidth = Math.round(Dimensions.get("window").width);

export function HomeScreen({navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const dispatch = useDispatch();
    const refNotification = useRef();
    const {getFcmToken} = useAuth();
    const notifications = useSelector((state) => state).notificationReducer;
    const chatBadge = useSelector((state) => state).chatBadgeReducer;
    const user = useSelector((state) => state).userReducer;
    const [refreshing, setRefreshing] = React.useState(false);
    const [fcm, setFcm] = useState()
    const chat = useRef(0)

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const res = await api.get('app/notification/count');
        dispatch({type: 'init_notifications', data: res.object.total_unread})

        wait(500).then(() => setRefreshing(false));
    }, []);

    const get = async () => {
        const res = await api.get("app/me");
        const aux = await getFcmToken()
        setFcm(aux)
    }

    const badgeChat = async () => {
        setLoading(true)
        try {
            const res = await api.get("app/chat/sector/list")
            chat.current = 0;

            for (let i = 0; i < res.object.length; i++) {

                if (res.object[i]?.chats[0]?.unread_messages) {

                    chat.current = chat.current + res.object[i]?.chats[0]?.unread_messages;

                }

            }
            dispatch({type: "init_badgeChat", data: chat.current});
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            Colors.primary = Colors.primary
            get()
            badgeChat()
        }, []),
    );

    return (
        <>
            <View style={styles.container}>
                <Toast ref={refNotification}/>

                <GeneralStatusBarColor backgroundColor={Colors.statusBar}
                                       barStyle="light-content"/>
                {/*<StatusBar*/}
                {/*  backgroundColor={Colors.primary}*/}
                {/*  barStyle="light-content"*/}
                {/*/>*/}
                <View style={{
                    backgroundColor: "#fafafa",
                    borderBottomWidth: 1, borderColor: '#e0dede'
                }}>
                    <View style={{flexDirection: "row", padding: 10, backgroundColor: Colors.primary}}>
                        <TouchableOpacity style={{justifyContent: "center",}}
                                          onPress={() => navigation.openDrawer()}>
                            {notifications > 0 || chatBadge > 0 &&
                            <Badge style={{
                                position: "absolute",
                                top: "25%",
                                right: "8%",
                                backgroundColor: "#ff190c",
                                fontWeight: "bold",
                                fontSize: 14,
                                elevation: 1
                            }}
                                   size={12}> </Badge>}
                            <Icon name={"menu-outline"} style={{}} size={35} color={'white'}/>
                        </TouchableOpacity>

                        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10}}>

                            <Text style={{
                                color: "white",
                                fontSize: Texts.title,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>CONSTRUINDO O
                                SABER</Text>
                            <Text style={{
                                color: "#8b98ae",
                                fontSize: Texts.subtitle,
                                textAlign: 'center'
                            }}>Alunos</Text>

                        </View>
                        <TouchableOpacity style={{width: 26, marginTop: 10, alignItems: "flex-end"}}
                                          onPress={() => {
                                          }}>

                        </TouchableOpacity>


                    </View>
                </View>
                <ScrollView style={{paddingHorizontal: 3}} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }>

                    <StudentList style={{margin: 3, elevation: 3}} refresh={refreshing} navigation={navigation}/>

                    {/*<Field*/}
                    {/*    multiline={5}*/}
                    {/*    value={fcm}*/}
                    {/*/>*/}
                    <View style={{padding: 20, flexDirection: 'row'}}>
                        <View style={{borderWidth: 5, borderColor: Colors.primary, borderRadius: 70, padding: 5}}>
                            <Image style={{height: screenWidth * 0.25, width: screenWidth * 0.25, borderRadius: 50}}
                                   source={{uri: 'https://1.bp.blogspot.com/-AVkl0Zdo0DI/X5tcP4uombI/AAAAAAAAEeE/JdxES_6EpjcbBAKwYG--Gk3-AF36YFNmQCLcBGAsYHQ/w1200-h630-p-k-no-nu/jujutsu-kaisen-sukuna-sorrindo.jpg'}}/>
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'verdana',fontWeight: "bold", color: 'black', fontSize: Texts.title}}>Vinicius Barbosa Martins</Text>
                            <Text style={{}}>1º série A</Text>
                        </View>

                    </View>
                </ScrollView>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    itemList: {
        flex: 1,
        margin: 3,
        height: 150,
        borderRadius: 10,
        backgroundColor: "white",
        elevation: 3,
    },
    subtitle: {
        color: Colors.secondary,
        fontSize: Texts.subtitle,

    },
    bg: {
        position: "absolute",
        left: 0,
        top: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    logo: {
        width: "100%",
        resizeMode: "contain",
        flex: 1
    },
});
