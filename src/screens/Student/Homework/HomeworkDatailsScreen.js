import React, {useState, useRef} from "react";
import {
    StyleSheet,
    Image,
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
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import partial from '../../../assets/icons/incomplete-icon-14.png'
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";


const screenHeight = Math.round(Dimensions.get("window").height);

const status = ['Data de entrega', 'Realizada', 'Parcialmente realizada', 'Não realizada']

const icon = ['', 'check', '', 'close']

export function HomeworkDetailsScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            if (!isVisible) {
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
                                        }}>{props.data.school_subject_description}
                                        </Text>

                                    </View>


                                    <Text style={{
                                        fontSize: Texts.normal,
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}>{props.item.student.person.name}</Text>
                                    <Text
                                        style={{fontSize: Texts.normal}}>{props.data.teacher_name ? props.data.teacher_name : '-'}</Text>
                                    <Text
                                        style={{fontSize: Texts.normal}}>Data de entrega: <Text
                                        style={{fontWeight: 'bold'}}>{props.data.homework_due_date ? moment(props.data.homework_due_date).format('DD/MM/YY') : '-'}</Text></Text>

                                </View>

                                <View style={{
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {props.data.status === 0 ?
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: Texts.title
                                            }}>{moment(props.data.homework_due_date).format('DD/MM')}</Text>
                                            :
                                            <>
                                                {props.data.status === 2 ?
                                                    <View style={{
                                                        borderRadius: 50,
                                                        backgroundColor: props.color ? props.color : '#1c2838',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 80,
                                                        width: 80,

                                                    }}>
                                                        <Image source={partial} style={{height: 50, width: 50}}/>

                                                    </View>
                                                    :
                                                    <View style={{
                                                        borderRadius: 50,
                                                        backgroundColor: props.color ? props.color : '#1c2838',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 80,
                                                        width: 80
                                                    }}>
                                                        <MaterialCommunityIcons name={icon[props.data.status]}
                                                                                style={{}}
                                                                                size={45}
                                                                                color={"white"}/>

                                                    </View>
                                                }

                                            </>
                                        }

                                        <Text style={{
                                            fontSize: Texts.normal,
                                            color: Colors.mediumGrey,
                                            marginTop: 5,
                                            textAlign: 'center'
                                        }}>{status[props.data.status]}</Text>
                                    </View>
                                </View>

                            </View>
                            {Platform.OS === 'ios' &&
                            <View style={{borderBottomWidth: 1, borderColor: 'grey'}}/>
                            }

                            <ScrollView style={{backgroundColor: 'white'}}>
                                <View style={{}}>
                                    <View style={[styles.item]}>
                                        <View style={{flex: 0.3}}>
                                            <Text style={{}}>Status: </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={{
                                                fontSize: Texts.subtitle,
                                                textAlign: 'right',
                                                fontWeight: 'bold',
                                                color: Colors.grey
                                            }}>{status[props.data.status]}</Text>
                                        </View>

                                    </View>
                                    <View style={[styles.item, {backgroundColor: 'white'}]}>
                                        <View style={{flex: 0.3}}>
                                            <Text style={{}}>Descrição: </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={{
                                                fontSize: Texts.subtitle,
                                                fontWeight: 'bold',
                                                color: Colors.grey,
                                                textAlign: 'right',
                                            }}>{props?.data.homework_description}</Text>
                                        </View>
                                    </View>
                                    {props?.data?.correction_note &&
                                    <View style={[styles.item]}>
                                        <View style={{flex: 0.3}}>
                                            <Text style={{}}>Correção: </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={{
                                                fontSize: Texts.subtitle,
                                                fontWeight: 'bold',
                                                color: Colors.grey,
                                                textAlign: 'right',
                                            }}>{props?.data.correction_note}</Text>
                                        </View>
                                    </View>
                                    }
                                </View>

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
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
    },
});
