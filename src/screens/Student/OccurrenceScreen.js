import React, {useState, useRef, useEffect} from "react";
import {
    Modal,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text, TouchableWithoutFeedback,
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
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";

const screenHeight = Math.round(Dimensions.get("window").height);

export function OccurrenceScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const data = useRef()
    const [objToShow, setObjToShow] = useState()
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`app/enrollment/${props.item.enrollment_id}/occurrence/list`);
            console.log(res)
            data.current = res.object;
            setLoading(false);
        } catch (e) {
            console.log(e)
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
            getData()
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
                        }}>Ocorrências</Text>

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
                                {data?.current?.map((item, index) =>
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.item, {
                                            borderLeftWidth: 5,
                                            borderColor: item.school_subject.color,
                                        }]}
                                        onPress={() => {
                                            setObjToShow(item)
                                            setIsVisible(true)

                                        }}>


                                        <View style={{
                                            padding: 10,
                                            backgroundColor: '#cacaca40',
                                            borderRadius: 5,
                                            width: 60,
                                            marginVertical: 10,
                                            justifyContent: 'center'
                                        }}>

                                            <Text style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: 'black'
                                            }}>{moment(item.teacher_class_room_occurrences[0]?.created_at).format('DD')}</Text>
                                            <Text style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: 'black'
                                            }}>{moment(item.teacher_class_room_occurrences[0]?.created_at).format('MMM').toUpperCase()}</Text>

                                        </View>
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            marginHorizontal: 5
                                        }}>
                                            <Text style={{
                                                fontSize: 16,
                                                color: Colors.grey,
                                                fontWeight: 'bold'
                                            }}>{item.teacher_class_room_occurrences[0]?.description}</Text>
                                            <Text style={{
                                                fontSize: Texts.listDescription,
                                            }}>
                                                {item.occurrence_note?.slice(0, 40)}
                                                {item.occurrence_note?.length > 40 &&
                                                <Text>...</Text>
                                                }
                                            </Text>

                                        </View>
                                        {/*<View style={{*/}
                                        {/*    padding: 10,*/}
                                        {/*    backgroundColor: item.school_subject.color + '20',*/}
                                        {/*    borderRadius: 5,*/}
                                        {/*    width: 60,*/}
                                        {/*    marginVertical: 10,*/}
                                        {/*    justifyContent: 'center',*/}
                                        {/*    alignItems: 'center'*/}
                                        {/*}}>*/}
                                        {/*    <Text style={{fontWeight: 'bold', color:item.school_subject.color,}}>{item.school_subject.description.slice(0, 3).toUpperCase()}</Text>*/}
                                        {/*</View>*/}
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isVisible}
                                onRequestClose={() => {
                                    setIsVisible(false);
                                }}
                            >
                                <TouchableOpacity style={styles.centeredView}
                                                  onPressOut={() => setIsVisible(false)}>
                                    <View style={styles.modalView}>

                                        <View style={{padding: 20}}>
                                            <View style={{marginBottom: 10}}>
                                                <Text style={{
                                                    color: objToShow?.school_subject?.color,
                                                    fontWeight: 'bold',
                                                    fontSize: Texts.title
                                                }}>
                                                    {objToShow?.school_subject?.description}
                                                </Text>
                                                <Text style={{}}>
                                                    {moment(objToShow?.teacher_class_room_occurrences[0]?.created_at).format("DD/MM/YYYY")}
                                                </Text>
                                            </View>
                                            <View >
                                                <Text style={{
                                                    fontSize: 17,
                                                    textAlign: "center",
                                                    marginBottom: 10,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {objToShow?.teacher_class_room_occurrences[0]?.description}
                                                </Text>

                                                <Text style={{
                                                    fontSize: Texts.listDescription,
                                                    textAlign: 'center'
                                                }}>
                                                    {objToShow?.occurrence_note}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderBottomLeftRadius: 10,
                                            borderBottomRightRadius: 10,
                                            padding: 7
                                        }} onPress={() => setIsVisible(false)}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Voltar</Text>
                                        </TouchableOpacity>

                                    </View>
                                </TouchableOpacity>


                            </Modal>
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
        flexDirection: 'row',
        height: 100,
        padding: 10,
        elevation: 2,
        backgroundColor: 'white',
        marginHorizontal: 5,
        marginVertical: 5,
        borderColor: "#d9dade",
        borderRadius: 6,
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
    },
    note: {
        fontSize: Texts.listDescription,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        minWidth: 250,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
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
