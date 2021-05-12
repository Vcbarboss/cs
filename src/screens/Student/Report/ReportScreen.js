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
        value: 10,
        color: '#80ED99'
    },
    {
        value: 9,
        color: '#6FD3B3'
    },
    {
        value: 8,
        color: '#5DBACC'
    },
    {
        value: 7,
        color: '#4CA0E6'
    },
    {
        value: 6,
        color: '#3A86FF'
    },
    {
        value: 5,
        color: '#FFCB47'
    },
    {
        value: 4,
        color: '#FFB139'
    },
    {
        value: 3,
        color: '#FF962B'
    },
    {
        value: 2,
        color: '#FF7C1C'
    },
    {
        value: 1,
        color: '#FF610E'
    },
    {
        value: 0,
        color: '#FF4700'
    },
]

export function ReportScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [data, setData] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [selected, setSelected] = useState("Bimestre 1");

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

                        <View style={{backgroundColor: 'white', margin: 10, width: 180}}>
                            <Picker
                                selectedValue={selected}
                                dropdownIconColor={Colors.theme}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelected(itemValue)
                                }>
                                <Picker.Item label={"Bimestre 1"} value={1}/>
                                <Picker.Item label={"Bimestre 2"} value={2}/>
                                <Picker.Item label={"Bimestre 3"} value={3}/>
                                <Picker.Item label={"Bimestre 4"} value={4}/>
                            </Picker>
                        </View>


                        <ScrollView>
                            {materias.map((item, index) =>
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => navigation.navigate('ReportDetailsScreen', {
                                        subject: item,
                                        color: notas[index]?.color,
                                        value: notas[index]?.value,
                                        selected: selected
                                    })}
                                >
                                    <View style={{padding: 20, flex: 1}}>
                                        <Text style={{fontSize: Texts.subtitle, fontWeight: 'bold'}}>
                                            {item}
                                        </Text>
                                        <View style={{justifyContent: 'flex-end',}}>
                                            <Text style={{fontSize: Texts.normal, color: Colors.mediumGrey}}>Faltas: 9</Text>
                                        </View>
                                    </View>

                                    <View style={{
                                        flex: 0.3,
                                        backgroundColor: notas[index]?.color,
                                        borderTopRightRadius: 15,
                                        borderBottomRightRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: 35
                                        }}>{notas[index]?.value}</Text>
                                    </View>

                                </TouchableOpacity>
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
    card: {
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        borderColor: "#d9dade",
        borderRadius: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
});
