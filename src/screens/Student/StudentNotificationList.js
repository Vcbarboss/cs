import React, {useState, useRef} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
    Modal,
    Platform,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import moment from "moment";
import "moment/locale/pt-br";
import Loading from "../../components/Loading";
import {NotificationComponent} from "../../components/NotificationComponent";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const screenHeight = Math.round(Dimensions.get("window").height);

const filterList = [
    {label: 'Lidas', value: 'READ'},
    {label: 'Não lidas', value: 'UNREAD'},
    {label: 'Todas', value: 'ALL'},
];

export function StudentNotificationList({route, navigation}) {

    const [loading, setLoading] = useState(true);
    const api = useApi({navigation});
    const refNotification = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const [id, setId] = useState();
    const [read, setRead] = useState()
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState({label: 'Todas', value: 'ALL'});
    let filterAux = useRef({label: 'Todas', value: 'ALL'}).current
    const notifications = useRef([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const paginate = useRef({page: 0});
    const altFilter = useRef(new Animated.Value(0)).current;
    const props = route.params;

    const getData = async (more) => {
        if (isFilter.current) {
            paginate.current.page = 0;
            notifications.current = [];
            isFilter.current = false;
        }
        if (!more) {
            paginate.current.page = 0;
            notifications.current = [];
        }
        more ? setLoadingMore(true) : setLoading(true);
        try {
            const res = await api.get(`app/notification/paginate?page=${paginate.current.page + 1}&limit=10&order_field=created_at&order_type=DESC&enrollment_id=${props.item.enrollment_id}&search_list=${filterAux.value}`);

            notifications.current = notifications.current.concat(res.object.data);

            paginate.current = {nextPage: res.object.next_page_url, page: res.object.current_page};
            more ? setLoadingMore(false) : setLoading(false);
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            more ? setLoadingMore(false) : setLoading(false);
        }


    };

    const handleScroll = (event) => {
        if (event.layoutMeasurement.height + event.contentOffset.y >= event.contentSize.height - 100) {

            if (paginate.current.nextPage && !loadingMore) {

                getData(true);
            }
        }
    };

    let openAlt = altFilter.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '20%']
    })

    const onFilter = () => {
        Keyboard.dismiss()
        if (!isFilter) {
            openFilter()
        } else {
            closeFilter()
        }

    }

    const openFilter = () => {
        setIsFilter(true)
        altFilter.setValue(0)
        Animated.spring(altFilter, {
            toValue: 100,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    const closeFilter = () => {
        setIsFilter(false)
        Animated.spring(altFilter, {
            toValue: 0,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    useFocusEffect(
        React.useCallback(() => {

            getData();

        }, []),
    );

    return (

        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={"padding"}
                enabled={Platform.OS === "ios"}
                style={{flex: 1}}
            >
                <Toast ref={refNotification}/>
                <GeneralStatusBarColor backgroundColor={Colors.statusBar}
                                       barStyle="light-content"/>
                {/*<StatusBar*/}
                {/*  backgroundColor={Colors.primary}*/}
                {/*  barStyle="light-content"*/}
                {/*/>*/}
                <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                    <TouchableOpacity style={{}} onPress={() => {
                        if (props?.notification) {
                            navigation.reset({index: 0, routes: [{name: "HomeStack"}]});
                        } else {
                            navigation.pop()
                        }

                    }}>
                        <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
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
                        }}>Notificações</Text>

                    </View>
                    <TouchableOpacity style={{alignItems: "center", justifyContent: 'center'}}
                                      onPress={() => onFilter()}>
                        <SimpleLineIcons name={'equalizer'} style={{}} size={25} color={'white'}/>
                    </TouchableOpacity>
                </View>
                <Animated.View
                    style={{
                        width: '100%',
                        height: openAlt,
                        backgroundColor: 'white',
                    }}
                >
                    {isFilter &&
                    <>

                        <View style={{
                            padding: 20,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: Texts.title,
                                    color: Colors.primary,
                                    marginBottom: 5
                                }}>Filtrar
                                por:</Text>
                            <View style={{
                                flexDirection: 'row',
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}>
                                {filterList.map((item, index) =>
                                    <TouchableOpacity
                                        style={[styles.filter, {backgroundColor: filter.value === item.value ? Colors.primary : 'white'}]}
                                        key={index}
                                        onPress={() => {
                                            onFilter()
                                            setFilter(item)
                                            filterAux = item
                                            getData()
                                        }}>
                                        {filter.value === item.value &&
                                        <MaterialCommunityIcons name={'check'} style={{marginRight: 5}}
                                                                size={20} color={'white'}/>
                                        }
                                        <Text
                                            style={{color: filter.value === item.value ? 'white' : Colors.primary}}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </>
                    }
                </Animated.View>
                {loading ? (
                        <>
                            <Toast ref={refNotification}/>
                            <Loading/>
                        </>
                    )
                    :
                    (
                        <>
                            {notifications.current.length > 0 ?
                                <ScrollView style={{}}
                                            onMomentumScrollEnd={(e) => handleScroll(e.nativeEvent)}>
                                    {notifications.current?.map((item, index) =>

                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.itemList, {
                                                borderLeftWidth: item.read_at ? 0 : 5,
                                                borderLeftColor: '#1698e7',
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.notification ,
                                                backgroundColor: item.read_at ? "rgba(0,41,107,0.04)" : 'white',
                                            }]}
                                            onPress={() => {
                                                setIsVisible(true)
                                                setId(item.push_notification_id);
                                                setRead(item.read_at)
                                            }}>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                marginHorizontal: 15,
                                                marginVertical: 10
                                            }}>
                                                <View style={{flex: 1}}>
                                                    <View style={{flex: 1, justifyContent: "center"}}>
                                                        <Text
                                                            style={[{fontSize: Texts.listTitle, fontWeight: 'bold', color: Colors.primary}]}>{item.title.length < 40 ? item.title : item.title.substring(0,35) + '...'}</Text>
                                                    </View>
                                                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                                                        {/*<Text*/}
                                                        {/*    style={[item.read_at ? styles.read : styles.notRead, {fontSize: Texts.listDescription}]}>{moment(item?.created_at.substr(0, 10)).format("L")} {item?.created_at.substr(11, 5)}</Text>*/}
                                                        <Text
                                                            style={{
                                                                color: Colors.read,
                                                            }}>{moment(item.created_at).fromNow()}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flex: 0.4,}}>
                                                    <View style={{
                                                        alignItems: "flex-end",
                                                        flex: 1,
                                                        justifyContent: "center"
                                                    }}>
                                                        {item.read_at ?
                                                            <Text
                                                                style={[{fontSize: Texts.listDescription, color: Colors.primary}]}>Lida</Text>
                                                            :
                                                            <Text
                                                                style={[{fontSize: Texts.listDescription, color: Colors.primary}]}>Não
                                                                lida</Text>
                                                        }
                                                    </View>
                                                    <View style={{
                                                        flex: 1,
                                                        alignItems: "flex-end",
                                                        justifyContent: "flex-end",
                                                    }}>
                                                        {/*<Text*/}
                                                        {/*    style={{*/}
                                                        {/*        color: !item.read_at ? Colors.primary : Colors.read,*/}
                                                        {/*        fontWeight: !item.read_at ? "bold" : "normal",*/}
                                                        {/*    }}>{moment(item.created_at).fromNow()}</Text>*/}
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>,
                                    )}


                                </ScrollView>
                                :
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 10
                                }}>
                                    {/*<Image source={logo} style={styles.logo} />*/}
                                    <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                                        {props.item.student.person.name.split(" ")[0]} ainda não possui
                                        nenhuma
                                        notificação
                                    </Text>
                                </View>
                            }
                        </>
                    )}
                {loadingMore &&
                <View style={{
                    position: 'absolute', bottom: 0,
                    left: 0,
                    right: 0,
                    textAlign: 'center'
                }}>
                    <Loading/>
                </View>
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isVisible}
                    onRequestClose={() => {
                        setIsVisible(false);
                    }}
                >
                    <NotificationComponent aluno={true} enrollment_id={props.item.enrollment_id} id={id}
                                           read={read} toast={(e) => refNotification.current.showToast(e)}
                                           close={(e) => {
                                               getData();
                                               setIsVisible(e);
                                           }}/>

                </Modal>
            </KeyboardAvoidingView>
        </View>

    );
}

const styles = StyleSheet.create({
    itemList: {
        padding: 10,
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    logo: {
        width: "100%",
        maxHeight: 150,
        resizeMode: "contain", flex: 1,
    },
    centeredView: {
        flex: 1,
        backgroundColor: "rgba(60, 60, 60, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    notRead: {
        color: Colors.primary,
        fontWeight: "bold"
    },
    read: {
        color: Colors.read,
        fontWeight: "normal",
    },
    filter: {
        height: 43,
        margin: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
});
