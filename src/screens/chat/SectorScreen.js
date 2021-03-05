import React, {useState, useCallback, useEffect, useRef} from "react";
import {GiftedChat} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import Loading from "../../components/Loading";
import {Text, TouchableOpacity, View, ScrollView, StyleSheet, Dimensions} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import {Texts} from "../../helpers/Texts";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Toast from "../../components/Toast";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {useDispatch} from "react-redux";
import {Badge,} from "react-native-paper";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function SectorScreen({navigation}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const api = useApi();
    const refNotification = useRef();
    const dispatch = useDispatch();

    const get = async () => {
        setLoading(true);
        try {
            const res = await api.get("app/chat/sector/list");
            setData(res.object);
            setLoading(false);
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            Colors.theme = Colors.primary;
            get();
        }, []),
    );

    return (
        <>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <>
                        <Toast ref={refNotification}/>
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: 23}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>Setores </Text>
                            </View>
                        </View>
                        <ScrollView>
                            <View style={{
                                display: "flex",
                                padding: 5,
                                flexWrap: 'wrap',
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                                {data?.length > 0 ?
                                    <>
                                    {data?.map((item, index) =>
                                        <View key={index}>
                                            <TouchableOpacity style={styles.itemList} onPress={() => {
                                                dispatch({type: 'rebase_sector', data: item.chat_sector_id})
                                                navigation.navigate("ChatScreen", {
                                                    item: item,
                                                });
                                            }}>

                                                {item?.chats[0]?.unread_messages > 0 &&
                                                <Badge style={{
                                                    position: "absolute",
                                                    top: "10%",
                                                    right: "10%",
                                                    backgroundColor: "#ff190c",
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                }} size={20}>
                                                    {item?.chats[0]?.unread_messages}
                                                </Badge>
                                                }

                                                <IonIcon name={"chatbubble-ellipses-outline"} size={30}/>
                                                <Text style={{textAlign: "center"}}>{item.description}</Text>
                                            </TouchableOpacity>
                                        </View>,
                                    )}
                                    </>
                                    :
                                    <View style={{flex:1, alignItems:'center', justifyContent: 'center', padding: 10}}>
                                        <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                                            Ainda não existe nenhum canal de chat disponível
                                        </Text>
                                    </View>
                                }

                            </View>
                        </ScrollView>
                    </>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    itemList: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#eaebef",
        marginVertical: 5,
        borderRadius: 15,
        minWidth: screenWidth * 0.475,
        height: 120,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        padding: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
    },
    title: {
        fontSize: Texts.listTitle,
        fontWeight: "bold",
        marginVertical: 5,
        color: Colors.primary,
    },
});
