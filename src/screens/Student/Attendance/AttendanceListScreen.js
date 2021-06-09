import React, {useState, useRef, useEffect} from "react";
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

// const materias = ["Artes", "Biologia", "Educacao Fisica", "Fisica", "Geografia", "Historia", "Ingles", "Matematica", "Portugues", "Quimica"]

// const colors = ["#3a86ff", "#02bef1", "#0091ad", "#4d908e", "#a2e983", "#ffae1b", "#ff6b6b", "#E63946", "#f72585", "#7209B7"]

const media = ['#80ED99', '#6FD3B3', '#5DBACC', '#4CA0E6', '#3A86FF', '#FFCB47', '#FFB139', '#FF962B', '#FF7C1C', '#FF610E', '#FF4700',]

const drop = ["Bimestre 1", "Bimestre 2", "Bimestre 3", "Bimestre 4", "Geral"]

const graph = [
    {
        month: new Date(2015, 0, 1),
        apples: 3840,
        bananas: 1920,
        cherries: 960,
        dates: 400,
        oranges: 400,
    },
    {
        month: new Date(2015, 1, 1),
        apples: 1600,
        bananas: 1440,
        cherries: 960,
        dates: 400,
    },
    {
        month: new Date(2015, 2, 1),
        apples: 640,
        bananas: 960,
        cherries: 3640,
        dates: 400,
    },
    {
        month: new Date(2015, 3, 1),
        apples: 3320,
        bananas: 480,
        cherries: 640,
        dates: 400,
    },
]

const colors = ['#7b4173', '#a55194', '#ce6dbd', '#de9ed6']
const keys = ['apples', 'bananas', 'cherries', 'dates']

const dados = [
    {
        title: "Matematica",
        presenca: 20,
        falta: 10,
        total: 58,
    },
    {
        title: "Portugues",
        presenca: 7,
        falta: 13,
        total: 58,
    },
    {
        title: "Ingles",
        presenca: 10,
        falta: 2,
        total: 48,
    },
    {
        title: "Biologia",
        presenca: 30,
        falta: 5,
        total: 48,
    },
]

export function AttendanceListScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const data = useRef()
    const attendance = useRef([])
    const [currentData, setCurrentData] = useState()

    const getData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`app/attendance/${props.item.enrollment_id}/list`);

            data.current = res.object;
            onChange(0)
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

    const onChange = (value) => {
        setCurrentData(data.current[value])

    }


    useEffect(() => {
        getData()
    }, []);

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
                <View style={{backgroundColor: Colors.opt1}}>

                </View>
                <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                    <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
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
                        }}>Frequências</Text>

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
                        <ScrollView>
                            {data.current?.map((item, index) =>
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => navigation.navigate('AttendanceDetailsScreen', {
                                        record: item,
                                        percent: ((item.total_attendance_present / (item.total_attendance_present + item.total_attendance_absent)) * 100).toFixed(1)
                                    })}
                                >
                                    <View style={{padding: 20, flex: 1}}>
                                        <Text style={{fontSize: Texts.subtitle, fontWeight: 'bold', color: Colors.grey}}>
                                            {item.description}
                                        </Text>


                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            height: 15,
                                            marginVertical: 10
                                        }}>
                                            <View style={{
                                                backgroundColor: Colors.tertiary,
                                                flex: (item.total_attendance_present / (item.total_attendance_present + item.total_attendance_absent)) > 0 ?
                                                    item.total_attendance_present / (item.total_attendance_present + item.total_attendance_absent) : 1,
                                                borderTopLeftRadius: 50,
                                                borderBottomLeftRadius: 50,
                                                borderTopRightRadius: item.total_attendance_absent === 0 ? 50 : 0,
                                                borderBottomRightRadius: item.total_attendance_absent === 0 ? 50 : 0,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {item.total_attendance_absent > 0 && item.total_attendance_present === 0 &&
                                                <Text></Text>
                                                }
                                                {item.total_attendance_absent === 0 && item.total_attendance_present === 0 &&
                                                <Text style={{color: 'white', fontSize: 10}}>
                                                    100%
                                                </Text>
                                                }
                                                {item.total_attendance_present > 0 &&
                                                <Text style={{color: 'white', fontSize: 10}}>
                                                    {((item.total_attendance_present / (item.total_attendance_present + item.total_attendance_absent)) * 100).toFixed(1)}%
                                                </Text>
                                                }
                                            </View>
                                            <View style={{
                                                backgroundColor: Colors.red,
                                                flex: (item.total_attendance_absent / (item.total_attendance_present + item.total_attendance_absent)) > 0 ?
                                                    item.total_attendance_absent / (item.total_attendance_present + item.total_attendance_absent) : 0,
                                                borderTopRightRadius: 50,
                                                borderBottomRightRadius: 50,
                                                borderTopLeftRadius: item.total_attendance_present === 0 ? 50 : 0,
                                                borderBottomLeftRadius: item.total_attendance_present === 0 ? 50 : 0,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {item.total_attendance_absent > 0 &&
                                                <Text style={{color: 'white', fontSize: 10}}>
                                                    {((item.total_attendance_absent / (item.total_attendance_present + item.total_attendance_absent)) * 100).toFixed(1)}%
                                                </Text>
                                                }
                                            </View>
                                        </View>

                                        <View style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}>
                                            <Text style={{fontSize: Texts.normal, color: Colors.mediumGrey}}>
                                                Presenças: {item.total_attendance_present}</Text>
                                            <Text style={{fontSize: Texts.normal, color: Colors.mediumGrey}}>
                                                Faltas: {item.total_attendance_absent}</Text>
                                            <Text> </Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    )}
            </View>

        </>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        // backgroundColor: 'white',
    },
    drop: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        margin: 10,
        borderRadius: 5,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
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
