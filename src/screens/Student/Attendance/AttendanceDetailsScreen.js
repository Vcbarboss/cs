import React, {useState, useRef} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
    Modal
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
import moment from "moment";

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
    const dots = useRef([])

    const present = {color: Colors.green, selectedDotColor: Colors.green};
    const absent = {color: Colors.red, selectedDotColor: Colors.red};
    const know = {color: Colors.tertiary, selectedDotColor: Colors.tertiary};

    const getData = () => {
        attendances.current = []

        Object.entries(props?.record?.attendance).forEach(([key, value]) => {

            //console.log(attendances.current[value])
            tst.current.push()


        })

        Object.entries(props?.record?.knowledge).forEach(([key, value]) => {
            knowledge.current.push(key)


            // attendances.current.push(
            //     {
            //         day: key,
            //         data: {
            //             marked: knowledge.current.includes(key),
            //         }
            //     }
            // )
        })

        Object.entries(props?.record?.attendance).forEach(([key, value]) => {

            dots.current = []

            for (let i = 0; i < value.length; i++) {
                if (value[i].present) {
                    dots.current.push(present)

                } else {
                    dots.current.push(absent)

                }

            }
            if (knowledge.current.includes(key)) {
                dots.current.push(know)
            }


            attendances.current.push(
                {
                    day: key,
                    data: {
                        dots: dots.current,
                    }
                }
            )


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
        let aux2;
        aux2 = []

        Object.entries(props?.record?.knowledge).forEach(([key, value]) => {
            if (day === key) {
                aux = value
            }
        })

        Object.entries(props?.record?.attendance).forEach(([key, value]) => {
            if (day === key) {
                for (let i = 0; i < value.length; i++) {
                    aux2.push(value[i])
                }
            }
        })

        console.log(moment(day).format('dddd, DD MMMM'))
        setObjToShow({
            ...objToShow,
            date: day,
            'knowledge': aux,
            'history': aux2
        })

    }


    useFocusEffect(
        React.useCallback(() => {
            if (!isVisible) {
                getData()
            }
        }, [isVisible]),
    );

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
                        }}>Detalhes</Text>

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
                            <View style={{
                                paddingTop: 20,
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
                            <View style={{marginTop: 15, backgroundColor: 'white'}}
                                // contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                            >
                                <Calendar
                                    markedDates={
                                        objToShow
                                    }
                                    markingType={'multi-dot'}
                                    onDayPress={(day) => {
                                        setIsVisible(true)
                                        getKnowledge(day.dateString)
                                    }}
                                    theme={{
                                        textMonthFontWeight: 'bold',
                                    }}
                                />


                                <View style={{
                                    justifyContent: 'center',
                                    borderTopWidth: 2,
                                    borderColor: Colors.lightgray,
                                    flexDirection: 'row',
                                }}>
                                    <View style={{flex: 1, padding: 20}}>
                                        <Text style={{textAlign: 'center', color: 'grey'}}>Selecione um dia marcado
                                            com <View style={{
                                                backgroundColor: Colors.tertiary,
                                                height: 5,
                                                width: 5,
                                                borderRadius: 50,
                                            }}/> para
                                            visualizar o conteúdo ministrado nesta data.</Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
            </View>


            <Modal
                transparent={true}
                visible={isVisible}
                onCloseRequest={() => setIsVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <View style={{padding: 35, borderBottomWidth: 2, borderColor: Colors.lightgray}}>
                            <Text style={{
                                color: 'black',
                                fontSize: Texts.listTitle,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: 5,
                            }}>{objToShow?.knowledge?.knowledge}</Text>
                            <Text style={{
                                fontSize: Texts.listDescription,
                                textAlign: 'center'
                            }}>{objToShow?.knowledge?.note}</Text>
                        </View>
                        <View style={{padding: 30}}>
                            <Text>{moment(objToShow.date).format('dddd, DD')} de {moment(objToShow.date).format('MMMM')}</Text>
                            {objToShow?.history?.map((item, index) =>

                                <View key={index}>

                                    <View
                                        style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{
                                            marginTop: 2,
                                            height: 8,
                                            width: 8,
                                            borderRadius: 100,
                                            backgroundColor: item.present ? Colors.green : Colors.red,
                                        }}/>
                                        {item.present ?
                                            <Text> presente</Text>
                                            :
                                            <Text> ausente</Text>

                                        }
                                        <Text> - {item.time_initial}</Text>
                                    </View>

                                </View>
                            )}

                        </View>
                        <TouchableOpacity
                            style={{alignSelf: 'flex-start',borderRadius: 20, padding: 10, position:'absolute',}}
                            onPress={() => setIsVisible(false)}>
                            <AntIcon name={"close"} style={{}} size={25} color={Colors.red}/>
                        </TouchableOpacity>
                    </View>
                </View>


            </Modal>
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
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
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
