import React, {useState, useRef, useEffect} from "react";
import {
    Image,
    StatusBar,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
    Modal, SafeAreaView, Platform, KeyboardAvoidingView,
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import moment from "moment";
import "moment/locale/pt-br";
import Loading from "../../components/Loading";
import {StudentProfileComponent} from "../../components/StudentProfileComponent";
import {NotificationComponent} from "../../components/NotificationComponent";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import {Checkbox, Switch} from "react-native-paper";
import FilterNotification from "../../components/FilterNotification";
import GeneralStatusBarColor from "../../components/StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);


const list = [
    {label: 'Lidas', value: 'Lidas'},
    {label: 'Não lidas', value: 'Não lidas'},
    {label: 'Todas', value: 'Todas'},
];

export function NotificationList({navigation}) {

    const [loading, setLoading] = useState(true);
    const api = useApi({navigation});
    const refNotification = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const [id, setId] = useState();
    const [read, setRead] = useState()
    const [filterModal, setFilterModal] = useState(false);
    const [filter, setFilter] = useState({label: 'Todas', value: 'Todas'});
    const notifications = useRef([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const paginate = useRef({page: 0});
    const isFilter = useRef(false);

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
            const res = await api.get(`app/notification/paginate?page=${paginate.current.page + 1}&limit=10&order_field=created_at&order_type=DESC&search_list=ALL`);

            if (filter.label === "Lidas") {
                for (let i = 0; i < res.object.data.length; i++) {
                    if (res.object.data[i].read_at) {
                        notifications.current = notifications.current.concat(res.object.data[i]);
                    }
                }
            } else if (filter.label === "Não lidas") {
                for (let i = 0; i < res.object.data.length; i++) {
                    if (!res.object.data[i].read_at) {
                        notifications.current = notifications.current.concat(res.object.data[i]);
                    }
                }
            } else {
                notifications.current = notifications.current.concat(res.object.data);
            }

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

    useFocusEffect(
        React.useCallback(() => {
            if (!isVisible) {
                getData();
            }
        }, [isVisible, filter]),
    );

    return (

        <>
            {loading ? (
                    <>
                        <Toast ref={refNotification}/>
                        <Loading/>
                    </>
                )
                :
                (
                    <View style={styles.container}>
                        <KeyboardAvoidingView
                            behavior={"padding"}
                            enabled={Platform.OS === "ios"}
                            style={{flex: 1}}
                        >
                            <Toast ref={refNotification}/>
                            <GeneralStatusBarColor backgroundColor={Colors.primary}
                                                   barStyle="light-content"/>
                            {/*<StatusBar*/}
                            {/*    backgroundColor={Colors.primary}*/}
                            {/*    barStyle="light-content"*/}
                            {/*/>*/}
                            <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>
                                <View>
                                    <TouchableOpacity style={{flex: 1}} onPress={() => {
                                        navigation.reset({index: 0, routes: [{name: "HomeStack"}]});
                                    }}>
                                        <AntIcon name={"arrowleft"} style={{marginTop: 20,}} size={25} color={"white"}/>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>
                                    <Text style={{color: "white", fontSize: 23,}}>Construindo o Saber</Text>
                                    <Text style={{color: "white", fontSize: Texts.subtitle,}}> Notificações </Text>
                                </View>
                                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}
                                                  onPress={() => setFilterModal(true)}>
                                    <Icon name={"filter-outline"} style={{}} size={25} color={"white"}/>
                                    <Text style={{color: 'white', fontWeight: 'bold'}}>{filter.label}</Text>
                                </TouchableOpacity>
                            </View>
                            {notifications.current.length > 0 ?
                                <ScrollView style={{}} onMomentumScrollEnd={(e) => handleScroll(e.nativeEvent)}>
                                    {notifications.current?.map((item, index) =>

                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.itemList, {}]}
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
                                                            style={[item.read_at ? styles.read : styles.notRead, {fontSize: Texts.listTitle}]}>{item.title}</Text>
                                                    </View>
                                                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                                                        <Text
                                                            style={[item.read_at ? styles.read : styles.notRead, {fontSize: Texts.listDescription}]}>{moment(item?.created_at.substr(0, 10)).format("L")} {item?.created_at.substr(11, 5)}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flex: 0.5,}}>
                                                    <View
                                                        style={{
                                                            alignItems: "flex-end",
                                                            flex: 1,
                                                            justifyContent: "center"
                                                        }}>
                                                        {item.read_at ?
                                                            <Text
                                                                style={[item.read_at ? styles.read : styles.notRead, {fontSize: Texts.listDescription}]}>Lido</Text>
                                                            :
                                                            <Text
                                                                style={[item.read_at ? styles.read : styles.notRead, {fontSize: Texts.listDescription}]}>Não
                                                                lido</Text>
                                                        }
                                                    </View>
                                                    <View style={{
                                                        flex: 1,
                                                        alignItems: "flex-end",
                                                        justifyContent: "flex-end"
                                                    }}>
                                                        <Text
                                                            style={[item.read_at ? styles.read : styles.notRead, {fontSize: Texts.listDescription}]}>{moment(item.created_at).fromNow()}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>,
                                    )}


                                </ScrollView>
                                :
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
                                    {/*<Image source={logo} style={styles.logo} />*/}
                                    <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                                        Você ainda não possui nenhuma notificação
                                    </Text>
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

                                <NotificationComponent aluno={false} id={id} read={read}
                                                       toast={(e) => refNotification.current.showToast(e)}
                                                       close={(e) => {
                                                           getData();
                                                           setIsVisible(e);
                                                       }}/>

                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={filterModal}
                                onRequestClose={() => {
                                    setFilterModal(false);
                                }}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>

                                        <FilterNotification title={'Filtre suas notificações'} list={list}
                                                            selected={filter.label} close={(e) => setFilterModal(e)}
                                                            select={(item) => {
                                                                isFilter.current = true;
                                                                setFilter(item);
                                                            }}/>
                                    </View>
                                </View>
                            </Modal>
                        </KeyboardAvoidingView>
                    </View>

                )}
        </>

    );
}

const styles = StyleSheet.create({
    itemList: {
        borderBottomWidth: 1,
        borderColor: Colors.notification,
        backgroundColor: "#fcfcfc",
        padding: 20,
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    logo: {
        width: "100%",
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
    }
});
