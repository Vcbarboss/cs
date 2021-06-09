import React, {useState, useRef} from "react";
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView, Modal,
} from "react-native";
import {Colors} from "../../../helpers/Colors";
import Toast from "../../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../../components/Loading";
import Field2 from "../../../components/Field2";
import {StudentProfileComponent} from "../../../components/StudentProfileComponent";
import {FormEditComponent} from "../../../components/FormEditComponent";
import {Texts} from "../../../helpers/Texts";
import moment from "moment";
import GeneralStatusBarColor from "../../../components/StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);

export function FormScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;

    const getData = async () => {
        setLoading(true);
        if (!props.item.filled) {
            navigation.navigate('FormEditScreen', {
                form_id: props.item.form_id
            })
        }
        try {
            const res = await api.get(`app/enrollment/${props.enrollment}/form/${props.item.form_id}`);

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
            getData();
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

                <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10,}}>
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
                        }}>{data?.form.title}</Text>

                    </View>
                    <TouchableOpacity style={{alignItems: "flex-end", justifyContent: "center"}}
                                      onPress={() => navigation.navigate('FormEditScreen', {
                                          form_id: props.item.form_id
                                      })}>
                        <AntIcon style={{marginRight: 10}} name={"edit"} size={28} color={"white"}/>
                    </TouchableOpacity>
                </View>
                {loading ? (
                        <Loading/>

                    )
                    :
                    (
                        <ScrollView style={{}}>
                            <View style={{}}>
                                {/*------------- Início do Form -------------*/}
                                {data?.section.map((item, index) =>
                                    <View style={{}} key={index}>
                                        <View style={{
                                            padding: 15,
                                            backgroundColor: "white",
                                        }}>
                                            <View style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.lightgray,
                                                paddingBottom: 10,
                                                marginBottom: 10
                                            }}>
                                                <Text style={{
                                                    fontWeight: "bold",
                                                    fontSize: 19,
                                                    color: 'black'
                                                }}>{item.description}</Text>
                                            </View>
                                            <View style={styles.cardContent}>
                                                {/*------------- Início dos Fields -------------*/}
                                                {item?.fields.map((field, ind) =>
                                                    <View key={ind}>
                                                        {field.type === "TEXT" ?
                                                            <>
                                                                <Text
                                                                    style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                <View style={styles.item}>

                                                                    {field.answered_form ?
                                                                        <Text style={[styles.subTitle, {flex: 1}]}>
                                                                            {field.answered_form}
                                                                        </Text>
                                                                        :
                                                                        <View style={{flex: 1}}>
                                                                            <Text style={[styles.subTitle, {flex: 1}]}>
                                                                                Nenhum
                                                                            </Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            </>
                                                            :
                                                            <>
                                                                {field.type === "SELECT" ?
                                                                    <>
                                                                        <Text
                                                                            style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                        <View style={styles.item}>

                                                                            <View style={{
                                                                                flex: 1,
                                                                                justifyContent: "center"
                                                                            }}>
                                                                                {field?.options.map((opt, position) =>
                                                                                    <View style={{flex: 1}}
                                                                                          key={position}>
                                                                                        {opt.selected ?
                                                                                            <Text
                                                                                                style={[styles.subTitle, {flex: 1}]}>{opt.answer}</Text>
                                                                                            :
                                                                                            <>
                                                                                            </>
                                                                                        }
                                                                                    </View>,
                                                                                )}
                                                                                {field?.note_enable &&
                                                                                <View style={styles.item}>
                                                                                    <Text
                                                                                        style={styles.title}>{field?.note_description}</Text>
                                                                                    <Text
                                                                                        style={styles.subTitle}>{field?.answered_note}</Text>

                                                                                </View>
                                                                                }
                                                                            </View>
                                                                        </View>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {field.type === "RADIO" ?
                                                                            <>
                                                                                <Text
                                                                                    style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                                <View style={styles.item}>

                                                                                    <View style={{
                                                                                        flex: 1,
                                                                                        justifyContent: "center"
                                                                                    }}>
                                                                                        {field?.options.map((opt, position) =>
                                                                                            <View style={{flex: 1}}
                                                                                                  key={position}>
                                                                                                {opt.selected ?
                                                                                                    <Text
                                                                                                        style={[styles.subTitle, {flex: 1}]}>{opt.answer}</Text>

                                                                                                    :
                                                                                                    <>
                                                                                                    </>
                                                                                                }

                                                                                            </View>,
                                                                                        )}
                                                                                        {field.note_enable &&
                                                                                        <View style={styles.item}>
                                                                                            <Text
                                                                                                style={styles.title}>{field?.note_description}</Text>
                                                                                            <Text
                                                                                                style={styles.subTitle}>{field?.answered_note}</Text>

                                                                                        </View>
                                                                                        }
                                                                                    </View>
                                                                                </View>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {field.type === "DATE" ?
                                                                                    <>
                                                                                        <Text
                                                                                            style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                                        <View style={styles.item}>

                                                                                            {field.answered_form ?
                                                                                                <Text
                                                                                                    style={[styles.subTitle, {flex: 1}]}>
                                                                                                    {moment(field?.answered_form).format("L")}
                                                                                                </Text>
                                                                                                :
                                                                                                <View style={{flex: 1}}>
                                                                                                    <Text
                                                                                                        style={[styles.subTitle, {flex: 1}]}>
                                                                                                        Nenhum
                                                                                                    </Text>
                                                                                                </View>
                                                                                            }
                                                                                        </View>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        {field.type === "HOUR" ?
                                                                                            <>
                                                                                                <Text
                                                                                                    style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                                                <View
                                                                                                    style={styles.item}>

                                                                                                    {field.answered_form ?
                                                                                                        <Text
                                                                                                            style={[styles.subTitle, {flex: 1}]}>
                                                                                                            {field?.answered_form}
                                                                                                        </Text>
                                                                                                        :
                                                                                                        <View
                                                                                                            style={{flex: 1}}>
                                                                                                            <Text
                                                                                                                style={[styles.subTitle, {flex: 1}]}>
                                                                                                                Nenhum
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                    }
                                                                                                </View>
                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                {field.type === "DATETIME" ?
                                                                                                    <>
                                                                                                        <Text
                                                                                                            style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                                                        <View
                                                                                                            style={styles.item}>

                                                                                                            {field.answered_form ?
                                                                                                                <Text
                                                                                                                    style={[styles.subTitle, {flex: 1}]}>
                                                                                                                    {moment(field?.answered_form).format("L")} - {field?.answered_form.substr(11)}
                                                                                                                </Text>
                                                                                                                :
                                                                                                                <View
                                                                                                                    style={{flex: 1}}>
                                                                                                                    <Text
                                                                                                                        style={[styles.subTitle, {flex: 1}]}>
                                                                                                                        Nenhum
                                                                                                                    </Text>
                                                                                                                </View>
                                                                                                            }
                                                                                                        </View>
                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        {field.type === "CHECKBOX" ?
                                                                                                            <>
                                                                                                                <Text
                                                                                                                    style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                                                                <View
                                                                                                                    style={styles.item}>

                                                                                                                    <View
                                                                                                                        style={{
                                                                                                                            flex: 1,
                                                                                                                            justifyContent: "center"
                                                                                                                        }}>
                                                                                                                        {field?.options.map((opt, position) =>
                                                                                                                            <View
                                                                                                                                style={{flex: 1}}
                                                                                                                                key={position}>
                                                                                                                                {opt.selected ?
                                                                                                                                    <View
                                                                                                                                        style={[styles.item, {
                                                                                                                                            flex: 1,
                                                                                                                                            borderColor: "#22c58b",
                                                                                                                                            backgroundColor: "#e9f9f4",
                                                                                                                                        }]}
                                                                                                                                        key={position}>
                                                                                                                                        <Text
                                                                                                                                            style={[styles.subTitle, {flex: 1}]}>{opt.answer}</Text>
                                                                                                                                    </View>
                                                                                                                                    :
                                                                                                                                    <>
                                                                                                                                    </>
                                                                                                                                }
                                                                                                                            </View>,
                                                                                                                        )}
                                                                                                                    </View>
                                                                                                                </View>
                                                                                                            </>
                                                                                                            :
                                                                                                            <>
                                                                                                                {field.type === "TEXTAREA" ?
                                                                                                                    <>
                                                                                                                        <Text
                                                                                                                            style={[styles.title, {flex: 1}]}>{field.label}</Text>
                                                                                                                        <View
                                                                                                                            style={styles.item}>

                                                                                                                            {field.answered_form ?
                                                                                                                                <Text
                                                                                                                                    style={[styles.subTitle, {flex: 1}]}>
                                                                                                                                    {field.answered_form}
                                                                                                                                </Text>
                                                                                                                                :
                                                                                                                                <View
                                                                                                                                    style={{flex: 1}}>
                                                                                                                                    <Text
                                                                                                                                        style={[styles.subTitle, {flex: 1}]}>
                                                                                                                                        Nenhum
                                                                                                                                    </Text>
                                                                                                                                </View>
                                                                                                                            }
                                                                                                                        </View>
                                                                                                                    </>
                                                                                                                    :
                                                                                                                    <>
                                                                                                                        {field.type === "FILE" ?
                                                                                                                            <>{/*TODO*/}
                                                                                                                            </>
                                                                                                                            :
                                                                                                                            <>
                                                                                                                            </>
                                                                                                                        }
                                                                                                                    </>
                                                                                                                }
                                                                                                            </>
                                                                                                        }
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        }
                                                                                    </>
                                                                                }
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                    </View>,
                                                )}
                                            </View>
                                        </View>
                                    </View>,
                                )}
                            </View>
                        </ScrollView>
                    )}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isVisible}
                    onRequestClose={() => {
                        setIsVisible(false);
                    }}
                >
                    <FormEditComponent data={props.item} id={props.enrollment} close={(e) => {
                        navigation.pop()
                        setIsVisible(e);
                    }}/>
                </Modal>
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    itemList: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#eaebef",
        margin: 5,
        borderRadius: 15,
        height: 120,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",

    },
    cardContent: {
        padding: 5,
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: Colors.backgroundDefault,
    },
    title: {
        fontSize: 17,
        marginVertical: 5,
        color: '#040816',
    },
    subTitle: {
        fontSize: 17,
    },
    Content: {
        fontSize: 18,
    },
    text: {
        fontSize: 20,
        paddingLeft: 5,
        fontWeight: "700",
        textAlign: "center",
    },
    item: {
        padding: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
        // borderColor: '#22c58b',
        // backgroundColor: '#e9f9f4',
        borderRadius: 5,
    },
});
