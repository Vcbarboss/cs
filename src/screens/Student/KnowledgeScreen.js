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

const screenHeight = Math.round(Dimensions.get("window").height);

export function KnowledgeScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const data = useRef()
    const [objToShow, setObjToShow] = useState()
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false);
    const attendances = useRef([])
    const knowledge = useRef([])
    const tst = useRef([])

    const getData = async () => {
        // setLoading(true);
        try {
            const res = await api.get(`app/attendance/${props.item.enrollment_id}/list`);

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
                        marked: knowledge.current.includes(key),
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
        setIsVisible(true)

        // Object.entries(props?.record?.knowledge).forEach(([key, value]) => {
        //     if (day === key) {
        //         aux = value
        //     }
        // })
        //
        // setObjToShow({...objToShow, 'knowledge': aux})

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

                        <View>
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
                        </View>
                        <ScrollView style={{padding: 20}}>
                            <Text style={{textAlign: 'center'}}>Selecione um dia marcado para visualizar o conteúdo
                                ministrado nesta data.</Text>
                        </ScrollView>
                    </View>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisible}
                    onRequestClose={() => {
                        setIsVisible(false)
                    }}
                >
                    <TouchableOpacity style={styles.centeredView} onPress={() => setIsVisible(false)}>
                        <TouchableOpacity style={styles.modalView} onPress={() => {}}>

                            <Text>Modal</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                </Modal>
        </>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        backgroundColor: 'white',
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
});
