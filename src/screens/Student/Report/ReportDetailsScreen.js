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

export function ReportDetailsScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false);

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
                        <View style={{flexDirection: "row", backgroundColor: 'white', padding: 10, elevation: 3,}}>
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
                                    }}>{props.record.school_subject_description}
                                    </Text>

                                </View>


                                <Text style={{
                                    fontSize: Texts.normal,
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}>{props.item.student.person.name}</Text>
                                <Text
                                    style={{fontSize: Texts.normal}}>{props.record.teacher_name ? props.record.teacher_name : '-'}</Text>
                                <Text
                                    style={{color: 'black'}}>{props.selected} {props.record.grade_status ? '- Resultado ' + props.record.grade_status : ''}</Text>
                                <Text style={{color: 'black', fontWeight: 'bold'}}>Média Anual: <Text
                                    style={{color: 'black'}}>{props.record.grade_anual ? props.record.grade_anual : '-'}</Text></Text>
                            </View>

                            <View style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>
                                <View>
                                    <View style={{
                                        borderRadius: 50,
                                        backgroundColor: props.record.grade_general ? Colors.notas[parseInt(props.record.grade_general)].color : '#1c2838',
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
                                            {props.record.grade_general ? props.record.grade_general : '-'}
                                        </Text>

                                    </View>
                                    <Text style={{
                                        fontSize: Texts.normal,
                                        color: Colors.mediumGrey,
                                        marginTop: 5
                                    }}> Faltas: {props.record.attendance}</Text>
                                </View>
                            </View>

                        </View>
                        {Platform.OS === 'ios' &&
                        <View style={{borderBottomWidth: 1, borderColor: 'grey'}}/>
                        }
                        <ScrollView style={{marginTop: 15, backgroundColor: 'white'}}>
                            {props.record.grade_list.map((item, index) =>
                                <View key={index}
                                      style={[styles.item, {backgroundColor: index % 2 == 0 ? 'white' : '#f3f5f8',}]}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            color: 'black'
                                        }}>{item.grade_type_description}</Text>
                                    </View>
                                    <View>
                                        <Text
                                            style={{fontSize: Texts.title}}>{item.grade ? item.grade : '-'}</Text>

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
