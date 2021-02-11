import React, {useState, useCallback, useEffect, useRef} from 'react'
import {GiftedChat} from 'react-native-gifted-chat'
import 'dayjs/locale/pt-br'
import Loading from "../../components/Loading";
import {Text, TouchableOpacity, View, ScrollView, StyleSheet} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Toast from "../../components/Toast";
import GeneralStatusBarColor from "../../components/StatusBarColor";

export function SectorScreen({navigation}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState()
    const api = useApi();
    const refNotification = useRef();


    const get = async () => {
        setLoading(true)
        try{
            const res = await api.get("app/chat/sector/list")
            console.log(res)
            setData(res.object)
            setLoading(false);
        }catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            Colors.theme = Colors.primary
            get()
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
                        <Toast ref={refNotification} />
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: 23,}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle,}}>Setores </Text>
                            </View>
                        </View>
                       <ScrollView>
                           {data?.map((item, index) =>
                               <TouchableOpacity key={index} style={[styles.item, {
                                   // backgroundColor: item.filled ? Colors.selected : "white",
                                   // borderColor: item.filled ? Colors.selectedBorder : "gainsboro",
                               }]} onPress={() => { navigation.navigate('ChatScreen' , {
                                   item: item
                               })}}>
                                   <Text style={styles.title}>{item.description}</Text>
                                   {/*<Text style={styles.subtitle}>{item.description}</Text>*/}
                               </TouchableOpacity>
                           )}
                       </ScrollView>
                    </>
                )
            }
        </>
    )
}
const styles = StyleSheet.create({
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
