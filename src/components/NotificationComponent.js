import React, {useState, useRef} from "react";
import {
    SafeAreaView,
    Alert,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text, Linking, KeyboardAvoidingView, Platform,
} from "react-native";
import {Colors} from "../helpers/Colors";
import Toast from "../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../helpers/Texts";
import moment from "moment";
import Loading from "../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import Field from "./Field";
import {Checkbox, Switch, RadioButton, Divider} from "react-native-paper";
import ButtonStyle1 from "./Buttons/ButtonStyle1";
import GeneralStatusBarColor from "./StatusBarColor";
import AutoHeightWebView from 'react-native-autoheight-webview'

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function NotificationComponent(props, {navigation}) {

    const [loading, setLoading] = useState(true);
    const api = useApi({navigation});
    const refNotification = useRef();
    const [data, setData] = useState();
    const [message, setMessage] = useState()
    const dispatch = useDispatch();
    const [checkedUnique, setCheckedUnique] = useState([]);
    const [checkedMultiple, setCheckedMultiple] = useState([]);
    const [open, setOpen] = useState("");
    const [answer, setAnswer] = useState([]);
    let time1;

    const getData = async () => {
        setLoading(true);

        try {
            if (props.aluno) {
                const res = await api.get(`app/notification/${props.id}/${props.enrollment_id}`);
                setMessage(res.object.push_notification.message)
                setData(res);
                if (!props.read) {
                    dispatch({type: "delete_notification"});
                }
            } else {
                const res = await api.get(`app/notification/${props.id}`);
                setMessage(res.object.push_notification.message)
                setData(res);
                if (!props.read) {
                    dispatch({type: "delete_notification"});
                }
            }

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

    const handleAnswer = async (type, answers) => {


        if (type === "unique") {
            if (answer.includes(answers)) {
                const aux = answers;
                setAnswer(answer.filter(item => item !== aux));
            } else {
                setAnswer([answers]);
            }
        } else if (type === "multiple") {
            if (answer.includes(answers)) {
                const aux = answers;
                setAnswer(answer.filter(item => item !== aux));
            } else {
                setAnswer([...answer, answers]);
            }
        } else {
        }
    };

    const alert = (e) => {
        if (checkedUnique.includes(e)) {

        } else {
            Alert.alert(
                "Deseja confirmar sua resposta?",
                "",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "OK", onPress: () => {
                            handleSend();
                        },
                    },
                ],
                {cancelable: false},
            );
        }
    };

    const handleSend = async () => {

        try {
            let objToSend = "";
            if (data.object.push_notification.survey_answer_type === "OPEN") {
                objToSend = {
                    "answer_open": open,

                };
            } else {
                objToSend = {
                    "answer_options":
                    answer,
                    "answer_open": open,

                };
            }

            let res;
            if (props.aluno) {
                res = await api.post(`app/notification/${data?.object.push_notification.push_notification_id}/answer/${props.enrollment_id}`, objToSend);

            } else {
                res = await api.post(`app/notification/${data?.object.push_notification.push_notification_id}/answer`, objToSend);

            }
            refNotification.current.showToast("success", "Resposta enviada!");
            time1 = setTimeout(async () => {
                props.close(false);
                clearTimeout(time1);
            }, 2000);
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getData();
        }, []),
    );

    return (
        <>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <View style={styles.container}>
                        <KeyboardAvoidingView
                            behavior={"padding"}
                            enabled={Platform.OS === "ios"}
                            style={{flex: 1}}
                        >
                            <GeneralStatusBarColor backgroundColor={Colors.primary}
                                                   barStyle="light-content"/>
                            <Toast ref={refNotification}/>

                            <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                                <TouchableOpacity style={{}} onPress={() => props.close(false)}>
                                    <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
                                </TouchableOpacity>
                                <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>
                                    <Text style={{color: "white", fontSize: Texts.title}}>Construindo o Saber</Text>

                                    <Text style={{color: "white", fontSize: Texts.subtitle}}>Conteúdo da
                                        Notificação </Text>
                                </View>
                            </View>
                            <ScrollView style={{
                                backgroundColor: "white",
                            }}>


                                <View style={{flex: 1, backgroundColor: "white"}}>
                                    <View style={{flex: 1, marginHorizontal: 20}}>
                                        <View style={{flex: 1, justifyContent: "center"}}>
                                            <Text style={{
                                                fontSize: 25,
                                                fontWeight: "bold",
                                                marginVertical: 20,
                                                textAlign: "center",
                                            }}>{data?.object.push_notification.title}</Text>

                                            {/*<HTML ignoredTags={tags} renderers={renderers} source={{html: data?.object.push_notification.message}}/>*/}
                                            {/*<Text*/}
                                            {/*  style={{*/}
                                            {/*    fontSize: 16,*/}
                                            {/*  }}>{data?.object.push_notification.message}</Text>*/}

                                            <AutoHeightWebView
                                                style={{width: Dimensions.get('window').width * 0.9, marginTop: 35}}
                                                customStyle={`
                                                      
                                                      p {
                                                        font-size: 16px;
                                                      }
                                                    `}
                                                onSizeUpdated={size => {}}
                                                files={[{
                                                    href: 'cssfileaddress',
                                                    type: 'text/css',
                                                    rel: 'stylesheet'
                                                }]}
                                                source={{html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' + message + '</body></html>'}}
                                                scalesPageToFit={true}
                                                viewportContent={'width=device-width, user-scalable=no'}
                                                originWhitelist={['*']}
                                            />
                                        </View>
                                        <View style={{alignItems: "flex-end"}}>


                                            <Text style={{
                                                fontSize: 13,
                                                marginVertical: 20,
                                                color: "#aeaeae",
                                            }}>{moment(data?.object.created_at.substr(0, 10)).format("L")} {data?.object.created_at.substr(11, 5)}</Text>

                                        </View>
                                        <Divider/>
                                        {data?.object.push_notification.pdf &&
                                        <TouchableOpacity style={{
                                            flexDirection: "row",
                                            borderWidth: 1,
                                            borderColor: "#7c7c7c",
                                            borderRadius: 10,
                                            padding: 20,
                                            backgroundColor: "white",
                                            justifyContent: "center",
                                        }} onPress={() => Linking.openURL(data?.object.push_notification.pdf)}>
                                            <AntIcon name={"pdffile1"} style={{}} size={20} color={"#f66"}/>
                                            <Text style={{color: "black", marginLeft: 10}}>
                                                Baixar PDF
                                            </Text>
                                        </TouchableOpacity>
                                        }
                                        {data?.object.answer_options[0] !== "" || data?.object.answer_open ?
                                            <View style={{marginVertical: 10}}>
                                                <View>
                                                    <Text style={{
                                                        textAlign: "center",
                                                        color: Colors.primary,
                                                        fontWeight: "bold",
                                                        fontSize: 16,
                                                    }}>{data?.object.push_notification.survey_description}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{
                                                        marginVertical: 10,
                                                        color: Colors.primary,
                                                        fontWeight: "bold",
                                                        fontSize: 16,
                                                    }}>Sua resposta foi: </Text>
                                                </View>
                                                {data.object.answer_open ?
                                                    <View>

                                                        <View>
                                                            {data.object.answer_open &&
                                                            <>
                                                                {data?.object.push_notification.push_notification_answers.map((item, index) =>

                                                                    <View key={index} style={{
                                                                        marginVertical: 2,
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        backgroundColor: data.object.answer_options.includes(item.answer) ? Colors.selected : "#f9f9f9",
                                                                        borderWidth: 1,
                                                                        borderColor: "gainsboro",
                                                                        borderRadius: 10,
                                                                        padding: 10,
                                                                        marginBottom: 10,
                                                                    }}>

                                                                        <Checkbox color={Colors.primary}
                                                                                  status={data.object.answer_options.includes(item.answer) ? "checked" : "unchecked"}
                                                                                  onPress={() => handleAnswer("multiple", item.answer)}/>
                                                                        <TouchableOpacity style={{flex: 1}}
                                                                                          onPress={() => handleAnswer("multiple", item.answer)}>
                                                                            <Text style={{
                                                                                fontSize: 12,
                                                                                maxWidth: "100%",
                                                                            }}> {item.answer}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>,
                                                                )}
                                                            </>

                                                            }
                                                        </View>
                                                        <View style={{
                                                            borderWidth: 1,
                                                            padding: 10,
                                                            borderColor: "#ba6430",
                                                            borderRadius: 4,
                                                        }}>
                                                            <Text style={{fontSize: 17, fontStyle: "italic"}}>
                                                                {data.object.answer_open}
                                                            </Text>
                                                        </View>

                                                    </View>
                                                    :
                                                    <View>
                                                        {data?.object.push_notification.push_notification_answers.map((item, index) =>

                                                            <View key={index} style={{
                                                                marginVertical: 2,
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                backgroundColor: data.object.answer_options.includes(item.answer) ? Colors.selected : "#f9f9f9",
                                                                borderWidth: 1,
                                                                borderColor: "gainsboro",
                                                                borderRadius: 10,
                                                                padding: 10,

                                                            }}>

                                                                <Checkbox color={Colors.primary}
                                                                          status={data.object.answer_options.includes(item.answer) ? "checked" : "unchecked"}
                                                                          onPress={() => handleAnswer("multiple", item.answer)}/>
                                                                <TouchableOpacity style={{flex: 1}}
                                                                                  onPress={() => handleAnswer("multiple", item.answer)}>
                                                                    <Text style={{
                                                                        fontSize: 12,
                                                                        maxWidth: "100%",
                                                                    }}> {item.answer}</Text>
                                                                </TouchableOpacity>
                                                            </View>,
                                                        )}
                                                    </View>
                                                }

                                            </View>
                                            :
                                            <>
                                                {data?.object.push_notification.survey_description ?
                                                    <View style={{marginVertical: 10}}>
                                                        <View>
                                                            <Text style={{
                                                                textAlign: "center",
                                                                color: Colors.primary,
                                                                fontWeight: "bold",
                                                                fontSize: 16,
                                                            }}>{data?.object.push_notification.survey_description}</Text>
                                                        </View>
                                                        {data?.object.push_notification.survey_answer_type === "UNIQUE" ?
                                                            <View>

                                                                {data?.object.push_notification.push_notification_answers.map((item, index) =>

                                                                    <View key={index} style={{
                                                                        margin: 10,
                                                                        marginTop: 5,
                                                                        marginBottom: 0,
                                                                    }}>
                                                                        {Platform.OS !== "ios" ?
                                                                            <View style={{
                                                                                flexDirection: "row",
                                                                                alignItems: "center",
                                                                                backgroundColor: answer.includes(item.answer) ? Colors.selected : "#f9f9f9",
                                                                                borderWidth: 1,
                                                                                borderColor: "gainsboro",
                                                                                borderRadius: 10,
                                                                                padding: 10,
                                                                            }}>
                                                                                <RadioButton color={Colors.primary}
                                                                                             status={answer.includes(item.answer) ? "checked" : "unchecked"}
                                                                                             onPress={() => handleAnswer("unique", item.answer)}/>
                                                                                <TouchableOpacity style={{flex: 1}}
                                                                                                  onPress={() => handleAnswer("unique", item.answer)}>
                                                                                    <Text style={{
                                                                                        fontSize: 12,
                                                                                        maxWidth: "100%",
                                                                                    }}> {item.answer}</Text>
                                                                                </TouchableOpacity>
                                                                            </View>

                                                                            :
                                                                            <>
                                                                                <View style={{
                                                                                    flexDirection: "row",
                                                                                    alignItems: "center",
                                                                                    backgroundColor: answer.includes(item.answer) ? Colors.selected : "#f9f9f9",
                                                                                    borderWidth: 1,
                                                                                    borderColor: "gainsboro",
                                                                                    borderRadius: 10,
                                                                                    padding: 10,
                                                                                }}>
                                                                                    <View
                                                                                        style={styles.roundCheck}>
                                                                                        <RadioButton
                                                                                            color={Colors.primary}
                                                                                            status={answer.includes(item.answer) ? "checked" : "unchecked"}
                                                                                            onPress={() => handleAnswer("unique", item.answer)}/>
                                                                                    </View>
                                                                                    <TouchableOpacity
                                                                                        style={{flex: 1}}
                                                                                        onPress={() => handleAnswer("unique", item.answer)}>
                                                                                        <Text
                                                                                            style={{
                                                                                                marginLeft: 10,
                                                                                                fontSize: 12,
                                                                                                maxWidth: "100%",
                                                                                                color: Colors.primary,
                                                                                            }}>{item.answer}
                                                                                        </Text>
                                                                                    </TouchableOpacity>
                                                                                </View>

                                                                            </>
                                                                        }
                                                                    </View>,
                                                                )}
                                                            </View>
                                                            :
                                                            <>
                                                                {data?.object.push_notification.survey_answer_type === "MULTIPLE" ?
                                                                    <View>
                                                                        {data?.object.push_notification.push_notification_answers.map((item, index) =>

                                                                            <View key={index} style={{
                                                                                margin: 10,
                                                                                marginTop: 5,
                                                                                marginBottom: 0,
                                                                            }}>
                                                                                {Platform.OS !== "ios" ?
                                                                                    <View style={{
                                                                                        flexDirection: "row",
                                                                                        alignItems: "center",
                                                                                        backgroundColor: answer.includes(item.answer) ? Colors.selected : "#f9f9f9",
                                                                                        borderWidth: 1,
                                                                                        borderColor: "gainsboro",
                                                                                        borderRadius: 10,
                                                                                        padding: 10,
                                                                                    }}>
                                                                                        <Checkbox color={Colors.primary}
                                                                                                  status={answer.includes(item.answer) ? "checked" : "unchecked"}
                                                                                                  onPress={() => handleAnswer("multiple", item.answer)}/>
                                                                                        <TouchableOpacity
                                                                                            style={{flex: 1}}
                                                                                            onPress={() => handleAnswer("multiple", item.answer)}>
                                                                                            <Text style={{
                                                                                                fontSize: 12,
                                                                                                maxWidth: "100%",
                                                                                            }}> {item.answer}</Text>
                                                                                        </TouchableOpacity>
                                                                                    </View>

                                                                                    :
                                                                                    <>
                                                                                        <View style={{
                                                                                            flexDirection: "row",
                                                                                            alignItems: "center",
                                                                                            backgroundColor: answer.includes(item.answer) ? Colors.selected : "#f9f9f9",
                                                                                            borderWidth: 1,
                                                                                            borderColor: "gainsboro",
                                                                                            borderRadius: 10,
                                                                                            padding: 10,
                                                                                        }}>
                                                                                            <View
                                                                                                style={styles.roundCheck}>
                                                                                                <Checkbox
                                                                                                    color={Colors.primary}
                                                                                                    status={answer.includes(item.answer) ? "checked" : "unchecked"}
                                                                                                    onPress={() => handleAnswer("multiple", item.answer)}/>
                                                                                            </View>

                                                                                            <TouchableOpacity
                                                                                                style={{flex: 1}}
                                                                                                onPress={() => handleAnswer("multiple", item.answer)}>
                                                                                                <Text style={{
                                                                                                    marginLeft: 10,
                                                                                                    fontSize: 12,
                                                                                                    maxWidth: "100%",
                                                                                                    color: Colors.primary,
                                                                                                }}>{item.answer}
                                                                                                </Text>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </>
                                                                                }
                                                                            </View>,
                                                                        )}
                                                                    </View>
                                                                    :
                                                                    <View>
                                                                        <Field
                                                                            placeholder="Sua resposta"
                                                                            label={"Resposta"}
                                                                            multiline={3}
                                                                            value={open}
                                                                            change={(e) => setOpen(e)}
                                                                        />
                                                                    </View>
                                                                }
                                                            </>
                                                        }
                                                        {data?.object.push_notification.survey_answer_type !== "OPEN" &&
                                                        <View style={{marginTop: 10, marginHorizontal: 10}}>
                                                            <Field
                                                                placeholder="Opcional"
                                                                label={"Comentário (opcional)"}
                                                                multiline={1}
                                                                value={open}
                                                                change={(e) => setOpen(e)}
                                                            />
                                                        </View>

                                                        }

                                                        <ButtonStyle1
                                                            text={"Enviar"}
                                                            style={{margin: 3, padding: 8, marginVertical: 10}}
                                                            loading={loading}
                                                            primaryColor={Colors.primary}
                                                            secondaryColor={Colors.primary}
                                                            color={"white"}
                                                            borderRadius={15}
                                                            onPress={() => {
                                                                alert();
                                                            }}
                                                        />
                                                    </View>
                                                    :
                                                    <>
                                                    </>
                                                }
                                            </>
                                        }


                                    </View>
                                </View>

                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>

                )}
        </>

    );
}

const styles = StyleSheet.create({

    itemList: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#eaebef",
        margin: 10,
        borderRadius: 15,
        padding: 10,

    },
    bg: {
        position: "absolute",
        left: 0,
        top: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    logo: {
        width: "100%",
        resizeMode: "contain", flex: 1,
    },

    logo2: {
        marginTop: 20,
        width: "50%",
        resizeMode: "contain",
        maxHeight: 60,
    },
    roundCheck: {
        justifyContent: "center",
        width: 35,
        height: 35,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.lightgray,
    },
    webView: {
        height: screenHeight,
        width: screenWidth * 0.8
    }
});
