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
import ProgressCircle from 'react-native-progress-circle'
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';

const screenHeight = Math.round(Dimensions.get("window").height);

const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

LocaleConfig.locales['br'] = {
    monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ],
    monthNamesShort: [
        "Jan.",
        "Fev.",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul.",
        "Ago",
        "Set.",
        "Out.",
        "Nov.",
        "Dez."
    ],
    dayNames: [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ],
    dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]
};

LocaleConfig.defaultLocale = "br";


export function AttendanceDetailsScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);

    const [objToShow, setObjToShow] = useState()
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false);
    const attendances = useRef([])
    const knowledge = useRef([])
    const tst = useRef([])

    const getData = () => {
        attendances.current = []

        Object.entries(props?.record?.attendance).forEach(([key, value]) => {

            //console.log(attendances.current[value])
            tst.current.push()


        })

        Object.entries(props?.record?.knowledge).forEach(([key, value]) => {
            knowledge.current.push(key)


            attendances.current.push(
                {
                    day: key,
                    data: {
                        marked: knowledge.current.includes(key),
                    }
                }
            )
        })

        Object.entries(props?.record?.attendance).forEach(([key, value]) => {

            if (knowledge.current.includes(key)) {

                attendances.current.push(
                    {
                        day: key,
                        data: {
                            marked: knowledge.current.includes(key),
                            dotColor: 'white',
                            customStyles: {
                                container: {
                                    backgroundColor: value ? Colors.green : Colors.red
                                },
                                text: {
                                    color: 'white'
                                },
                            }
                        }
                    }
                )
            } else {
                attendances.current.push(
                    {
                        day: key,
                        data: {
                            customStyles: {
                                container: {
                                    backgroundColor: value ? Colors.green : Colors.red
                                },
                                text: {
                                    color: 'white'
                                },
                            }
                        }
                    }
                )
            }


        })


        let aux;
        for (let i = 0; i < attendances.current.length; i++) {
            const day = attendances.current[i].day
            const data = attendances.current[i].data
            //console.log(day)

            aux = {...aux, [day]: data}
            // console.log(aux)
        }
        setObjToShow(aux)
        attendances.current.map((item, index) => {

            }
        )
        // console.log(attendances.current)
    }

    const getKnowledge = (day) => {

        let aux;

        Object.entries(props?.record?.knowledge).forEach(([key, value]) => {
            if (day === key) {
                aux = value
            }
        })

        setObjToShow({...objToShow, 'knowledge': aux})

    }


    useFocusEffect(
        React.useCallback(() => {
            if (!isVisible) {
                console.log(props)
                getData()
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
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        {/*<StatusBar*/}
                        {/*  backgroundColor={Colors.primary}*/}
                        {/*  barStyle="light-content"*/}
                        {/*/>*/}
                        <View style={{backgroundColor: Colors.opt1}}>

                        </View>
                        <View style={{flexDirection: "row", backgroundColor: 'white', padding: 10, elevation: 3,}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={Colors.primary}/>
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
                                        color: Colors.primary
                                    }}>{props.record.description}
                                    </Text>

                                </View>


                                <Text style={{
                                    fontSize: Texts.normal,
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}>{props.item.student.person.name}</Text>
                                <Text
                                    style={{fontSize: Texts.normal}}>{props.record.teacher_name ? props.record.teacher_name : '-'}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{height: 12, width: 12, backgroundColor: Colors.green}}/>
                                    <Text> - Presenças</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{height: 12, width: 12, backgroundColor: Colors.red}}/>
                                    <Text> - Faltas</Text>
                                </View>
                            </View>

                            <View style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>
                                <View>
                                    <ProgressCircle
                                        percent={parseFloat(props?.percent)}
                                        radius={50}
                                        borderWidth={8}
                                        color={Colors.green}
                                        shadowColor="#999"
                                        bgColor="#fff"
                                    >
                                        <Text style={{fontSize: 18}}>{props?.percent}%</Text>
                                    </ProgressCircle>
                                    <Text style={{textAlign: 'center'}}>Presenças</Text>
                                </View>
                            </View>

                        </View>
                        {Platform.OS === 'ios' &&
                        <View style={{borderBottomWidth: 1, borderColor: 'grey'}}/>
                        }
                        <ScrollView style={{marginTop: 15, backgroundColor: 'white'}}
                            // contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                        >
                            <Calendar
                                markedDates={
                                    objToShow
                                }
                                markingType={'custom'}
                                onDayPress={(day) => {
                                    getKnowledge(day.dateString)
                                }}
                                theme={{
                                    textMonthFontWeight: 'bold',
                                }}
                            />
                        </ScrollView>

                        <View style={{
                            padding: 20,
                            paddingVertical: 30,
                            borderTopWidth: 2,
                            borderColor: Colors.lightgray
                        }}>
                            {objToShow?.knowledge?.knowledge ?
                                <>
                                    {/*<Text style={{color: Colors.primary}}>Conteúdo ministrado*/}
                                    {/*    em <Text style={{fontWeight: 'bold'}}>{objToShow?.knowledge?.date}</Text>:</Text>*/}
                                    <Text style={{
                                        color: 'black',
                                        fontSize: Texts.listTitle,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        marginBottom: 5
                                    }}>{objToShow?.knowledge?.knowledge}</Text>
                                    <Text style={{fontSize: Texts.listDescription, textAlign: 'center'}}>{objToShow?.knowledge?.note}</Text>
                                </>
                                :
                                <>
                                    <Text style={{textAlign: 'center'}}>Selecione um dia marcado para visualizar o conteúdo
                                        ministrado nesta data.</Text>
                                </>
                            }

                        </View>

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
