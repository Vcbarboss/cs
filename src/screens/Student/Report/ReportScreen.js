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

const colors = {}

export function ReportScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const data = useRef()
    const [isVisible, setIsVisible] = useState(false);
    const sections = useRef([])
    const [currentData, setCurrentData] = useState()
    const [selected, setSelected] = useState("Bimestre 1");

    const getData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`app/student-grade/${props.item.enrollment_id}/list`);
            sections.current = []
            data.current = res.object;
            for (let i = 0; i < res.object.length; i++) {
                sections.current.push(res.object[i].stage_description)
            }
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
                        }}>Boletim Escolar</Text>

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
                            <View style={styles.drop}>
                                <Picker
                                    mode={"dialog"}
                                    selectedValue={selected}
                                    dropdownIconColor={Colors.primary}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelected(itemValue)
                                        onChange(itemValue)
                                    }}>
                                    {sections.current.map((item, index) =>
                                        <Picker.Item label={item} value={index} key={index}/>
                                    )}
                                </Picker>
                                <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                            </View>


                            <ScrollView>
                                {currentData?.school_subject_list.map((item, index) =>
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.card}
                                        onPress={() => navigation.navigate('ReportDetailsScreen', {
                                            record: item,
                                            selected: currentData.stage_description,
                                            attendance: currentData.attendance
                                        })}
                                    >
                                        <View style={{padding: 20, flex: 1}}>
                                            <Text style={{fontSize: Texts.subtitle, fontWeight: 'bold'}}>
                                                {item.school_subject_description}
                                            </Text>
                                            <View style={{justifyContent: 'flex-end',}}>
                                                <Text style={{fontSize: Texts.normal, color: Colors.mediumGrey}}>
                                                    Faltas: {item.attendance}</Text>
                                            </View>
                                        </View>

                                        <View style={{
                                            flex: 0.3,
                                            backgroundColor: item.grade_general ? Colors.notas[parseInt(item.grade_general)]?.color : '#1c2838',
                                            borderTopRightRadius: 15,
                                            borderBottomRightRadius: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: 30
                                            }}>{item.grade_general ? item.grade_general : '-'}</Text>
                                            <Text
                                                style={{color: 'white'}}>{item.grade_status ? item.grade_status : "Parcial"}</Text>
                                        </View>

                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </>
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
