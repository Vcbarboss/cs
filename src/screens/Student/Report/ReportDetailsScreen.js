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
import {Colors} from "../../../helpers/Colors";
import Toast from "../../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../../components/Loading";
import ButtonStyle1 from "../../../components/Buttons/ButtonStyle1";
import {Texts} from "../../../helpers/Texts";
import GeneralStatusBarColor from "../../../components/StatusBarColor";
import {Picker} from '@react-native-picker/picker';

const screenHeight = Math.round(Dimensions.get("window").height);

const materias = ["Artes", "Biologia", "Educacao Fisica", "Fisica", "Geografia", "Historia", "Ingles", "Matematica", "Portugues", "Quimica"]

const colors = ["#3a86ff", "#02bef1", "#0091ad", "#4d908e", "#a2e983", "#ffae1b", "#ff6b6b", "#E63946", "#f72585", "#7209B7"]

const notas = [
    {
        title: 'Nota Mensal 1',
        value: 4,
    },
    {
        title: 'Nota Mensal 2',
        value: 8,
    },
    {
        title: 'Nota Bimestral',
        value: 6,
    },
    {
        title: 'Nota de Projetos',
        value: 6,
    },
    {
        title: 'Simulado 1',
        value: 3,
    },
    {
        title: 'Simulado 2',
        value: 2,
    },
    {
        title: 'Média Final',
        value: 6,
    },
]

export function ReportDetailsScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [data, setData] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [selected, setSelected] = useState();

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
                console.log(props)
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
                        <View style={{flexDirection: "row", backgroundColor: 'white', padding: 20, elevation: 3,}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={Colors.theme}/>
                            </TouchableOpacity>

                        </View>
                        <View style={{
                            elevation: 3,
                            backgroundColor: 'white',
                            paddingHorizontal: 30,
                            flexDirection: 'row',
                            paddingBottom: 20
                        }}>
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 30,
                                        color: Colors.theme
                                    }}>{props.subject}
                                    </Text>

                                </View>


                                <Text style={{
                                    fontSize: Texts.normal,
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}>{props.item.student.person.name}</Text>
                                <Text style={{fontSize: Texts.normal}}>Professor(a): Albert Einstein</Text>
                                <Text style={{color: 'black'}}>{props.selected} </Text>
                            </View>
                            <View style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>
                                <View>
                                    <View style={{
                                        borderRadius: 50,
                                        backgroundColor: props.color,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 80,
                                        width: 80
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: 35
                                        }}>
                                            {props.value}
                                        </Text>

                                    </View>
                                    <Text style={{fontSize: Texts.normal, color: Colors.mediumGrey ,marginTop: 5}}>    Faltas: 9</Text>
                                </View>
                            </View>

                        </View>

                        <ScrollView style={{marginTop: 15, backgroundColor: 'white'}}>
                            {notas.map((item, index) =>
                                <View key={index}
                                      style={[styles.item, {backgroundColor: index % 2 == 0 ? 'white' : '#f3f5f8',}]}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{fontWeight: 'bold', color: 'black'}}>{item.title}</Text>
                                    </View>
                                    <View>
                                        <Text style={{fontSize: Texts.title}}>{item.value}</Text>

                                    </View>

                                </View>
                            )}
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
        backgroundColor: 'white'
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

        flexDirection: 'row',
        padding: 15,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
    },
});
