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
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../components/Loading";
import {Texts} from "../../helpers/Texts";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {Calendar} from "react-native-calendars";
import moment from "moment";

const screenHeight = Math.round(Dimensions.get("window").height);

export function KnowledgeScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const data = useRef()
    const [objToShow, setObjToShow] = useState({})
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false);
    const attendances = useRef([])
    const [knowledge, setKnowledge] = useState([])
    const tst = useRef([])
    let month = useRef(moment().format('M')).current

    const getData = async (first) => {
        if (first) {
            setLoading(true);
        }

        try {
            const res = await api.get(`app/enrollment/${props.item.enrollment_id}/knowledge/${month}/list`);

            data.current = res.object;
            formatData()
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

    const formatData = () => {
        attendances.current = []

        Object.entries(data.current).forEach(([key, value]) => {

            attendances.current.push(
                {
                    day: key,
                    data: {
                        marked: true,
                        value: value
                    }
                }
            )
        })
        let aux;
        for (let i = 0; i < attendances.current.length; i++) {
            const day = attendances.current[i].day
            const data = attendances.current[i].data
            // console.log(day)

            aux = {...aux, [day]: data}
            // console.log(aux)
        }
        setObjToShow(aux)
        attendances.current.map((item, index) => {

            }
        )
    }

    const getKnowledge = (day) => {

        if (objToShow) {
            let aux2;
            aux2 = []

            Object.entries(objToShow).forEach(([key, value]) => {
                if (key === day) {
                    for (let i = 0; i < value.value.length; i++) {
                        aux2.push(value.value[i])
                    }
                }

            })

            setKnowledge({
                ...knowledge,
                date: day,
                data: aux2
            })
        }

    }

    const getMonth = (e) => {
        // setKnowledge()
        month = e.month;
        getData()
    }


    useFocusEffect(
        React.useCallback(() => {
            getData(true)
        }, []),
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
                        }}>Conteúdos</Text>

                    </View>
                </View>
                {loading ? (
                        <Loading/>

                    )
                    :
                    (
                        <>
                            <ScrollView style={{padding: 5}}
                                        contentContainerStyle={{flexGrow: 1}}>

                                <Calendar
                                    markedDates={
                                        objToShow
                                    }
                                    markingType={'custom'}
                                    onMonthChange={(month) => getMonth(month)}
                                    onDayPress={(day) => {
                                        getKnowledge(day.dateString)
                                    }}
                                    theme={{
                                        textMonthFontWeight: 'bold',
                                    }}
                                />
                                {!knowledge?.data &&
                                <Text style={{textAlign: 'center'}}>Selecione um dia marcado para visualizar o conteúdo
                                    ministrado nesta data.</Text>
                                }
                                {knowledge?.data?.map((item, index) =>
                                    <View key={index} style={[styles.item, {borderColor: item.school_subject.color}]}>
                                        <View style={{padding: 5, backgroundColor: item.school_subject.color + '20'}}>
                                            <Text
                                                style={[styles.title, {color: item.school_subject.color}]}>{item.school_subject.description}</Text>
                                        </View>
                                        <View style={{padding: 10}}>
                                            <Text style={styles.knowledge}>{item.knowledge}</Text>
                                            <Text style={styles.note}>{item.note}</Text>
                                        </View>
                                    </View>
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
        backgroundColor: 'white',
    },
    item: {
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: "#d9dade",
        margin: 5,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    title: {
        fontSize: Texts.listTitle,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    knowledge: {
        color: 'black',
        fontSize: Texts.listTitle,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    note: {
        fontSize: Texts.listDescription,
        textAlign: 'center',
    }
});
