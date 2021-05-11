import React, {useState, useRef} from "react";
import {
    Modal,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../components/Loading";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import {Texts} from "../../helpers/Texts";
import GeneralStatusBarColor from "../../components/StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);

export function ReportScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [data, setData] = useState();
    const [isVisible, setIsVisible] = useState(false);


    const getData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`app/enrollment/${props.item.enrollment_id}/auth-person/list`);
            console.log(res)
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
            if (!isVisible) {
                // getData()
            }
        }, [isVisible]),
    );

    return (
        <>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <View style={styles.container}>
                        <Toast ref={refNotification}/>
                        <GeneralStatusBarColor backgroundColor={Colors.theme}
                                               barStyle="light-content"/>
                        {/*<StatusBar*/}
                        {/*  backgroundColor={Colors.theme}*/}
                        {/*  barStyle="light-content"*/}
                        {/*/>*/}
                        <View style={{backgroundColor: Colors.opt1}}>

                        </View>
                        <View style={{flexDirection: "row", backgroundColor: Colors.theme, padding: 20}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: 23,}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle,}}>Boletim Escolar</Text>

                            </View>
                            <TouchableOpacity style={{marginTop: 10, alignItems: "flex-end"}}
                                              onPress={() => setIsVisible(true)}>

                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <Text>
                                Boletim Escolar
                            </Text>
                        </ScrollView>

                    </View>
                )}
        </>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        backgroundColor: 'white',
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
    title: {
        fontSize: Texts.listTitle,
        fontWeight: "bold",
        marginVertical: 5,
        color: Colors.primary,
    },
    subtitle: {
        fontSize: Texts.listDescription,
        marginTop: 5,
        color: Colors.primary
    },
    item: {
        padding: 20,
        paddingHorizontal: 10,
        //margin: 5,
        borderBottomWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
        // borderColor: '#22c58b',
        // backgroundColor: '#e9f9f4',
        //borderRadius: 5,
    },
});
