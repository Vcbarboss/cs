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
import moment from "moment";
import image from "../assets/imgs/userStudent.png";

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

                <GeneralStatusBarColor backgroundColor={'rgba(0,41,107,0.42)'}
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

                    <StudentList style={{}} refresh={refreshing} navigation={navigation}/>

                    {/*<Field*/}
                    {/*    multiline={5}*/}
                    {/*    value={fcm}*/}
                    {/*/>*/}


                    {/*<TouchableOpacity style={[styles.itemList,{*/}
                    {/*    backgroundColor: 'white',*/}
                    {/*    borderTopColor: Colors.tertiary,*/}
                    {/*    // borderBottomColor: Colors.tertiary,*/}
                    {/*    borderTopWidth: 5,*/}
                    {/*    // borderBottomWidth: 5,*/}
                    {/*    height: 130,*/}
                    {/*    borderRadius: 5*/}
                    {/*}]} onPress={() => {*/}
                    {/*    props.navigation.navigate("StudentStack", {*/}
                    {/*        item: item,*/}
                    {/*    });*/}
                    {/*}}>*/}
                    {/*    <View*/}
                    {/*        style={{flexDirection: 'row', }}>*/}
                    {/*        <View style={{flex: 0.7, justifyContent: "center", padding: 10}}>*/}
                    {/*            <Text style={[styles.name, {}]}>Ryomen Sukuna</Text>*/}
                    {/*            <Text*/}
                    {/*                style={styles.class}>1000+ anos</Text>*/}
                    {/*            <Text style={[styles.class, {}]}>Classe Especial</Text>*/}
                    {/*        </View>*/}
                    {/*        <View style={{*/}
                    {/*            borderColor:  Colors.opt1,*/}
                    {/*            borderWidth: 2,*/}
                    {/*            backgroundColor: 'white',*/}
                    {/*            borderRadius: 55,*/}
                    {/*            padding: 3,*/}
                    {/*            position: 'absolute',*/}
                    {/*            right: 10,*/}
                    {/*            top: -7*/}
                    {/*        }}>*/}
                    {/*            <Badge size={25} style={{*/}
                    {/*                position: "absolute",*/}
                    {/*                top: -10,*/}
                    {/*                right: 10,*/}
                    {/*                zIndex: 10,*/}
                    {/*            }}>2</Badge>*/}
                    {/*            <Image style={{*/}
                    {/*                height: screenWidth * 0.22,*/}
                    {/*                width: screenWidth * 0.22,*/}
                    {/*                borderRadius: 50*/}
                    {/*            }}*/}
                    {/*                   source={{uri: 'https://1.bp.blogspot.com/-AVkl0Zdo0DI/X5tcP4uombI/AAAAAAAAEeE/JdxES_6EpjcbBAKwYG--Gk3-AF36YFNmQCLcBGAsYHQ/w1200-h630-p-k-no-nu/jujutsu-kaisen-sukuna-sorrindo.jpg'}}/>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}

                </ScrollView>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    itemList: {
        justifyContent: 'center',
        margin: 7,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
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
    },
    logo: {
        width: "100%",
        resizeMode: "contain",
        flex: 1
    },
    name: {
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.grey
    },
    class: {
        fontSize: 15,
    },
});
