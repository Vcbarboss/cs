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
            Colors.primary = Colors.primary;
            get();
        }, []),
    );

    return (
        <>

            <Toast ref={refNotification}/>
            <GeneralStatusBarColor backgroundColor={Colors.statusBar}
                                   barStyle="light-content"/>
            <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                    <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
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
                    }}>Setores</Text>

                </View>
                <TouchableOpacity style={{width: 26, marginTop: 10, alignItems: "flex-end"}}
                                  onPress={() => {
                                  }}>

                </TouchableOpacity>
            </View>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <>
                        <ScrollView>
                            <View style={{
                                display: "flex",
                                padding: 5,
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


                                                    <Text style={{
                                                        fontSize: Texts.title,
                                                        flex: 1
                                                    }}>{item.description}</Text>
                                                    <IonIcon style={{}} name={"chatbubble-ellipses-outline"} size={30}/>
                                                </TouchableOpacity>
                                            </View>,
                                        )}
                                    </>
                                    :
                                    <View
                                        style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
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
        padding: 20,
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: 'white',
        marginHorizontal: 5,
        marginVertical: 5,
        borderColor: "#d9dade",
        borderRadius: 7,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
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
