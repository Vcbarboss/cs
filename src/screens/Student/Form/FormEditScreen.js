import React, {useState, useRef, useEffect} from "react";
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Alert,
    BackHandler, ActivityIndicator,
} from "react-native";
import {Colors} from "../../../helpers/Colors";
import Toast from "../../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../../components/Loading";
import Field2 from "../../../components/Field2";
import SelectField2 from "../../../components/SelectField2";
import SelectField from "../../../components/SelectField";
import {maskDate, maskDateTime, maskHour} from "../../../helpers/Functions";
import moment from "moment";
import {Checkbox, Switch} from "react-native-paper";
import {Texts} from "../../../helpers/Texts";
import Field from "../../../components/Field";
import GeneralStatusBarColor from "../../../components/StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);

export function FormEditScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [data, setData] = useState();
    const objToSend = useRef();
    const auxShow = useRef();
    const [objToShow, setObjToShow] = useState();
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;

    const getData = async () => {

        setLoading(true);
        try {
            const res = await api.get(`app/enrollment/${props.item.enrollment_id}/form/${props.form_id}`);
            setData(res.object);

            for (let i = 0; i < res.object.section.length; i++) {
                for (let f = 0; f < res.object.section[i].fields.length; f++) {
                    if (res.object.section[i].fields[f].type === "TEXT"
                        || res.object.section[i].fields[f].type === "TEXTAREA"
                        || res.object.section[i].fields[f].type === "TIME") {
                        objToSend.current = {
                            ...objToSend.current,
                            ["field_" + res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].answered_form,
                        };
                        auxShow.current = {
                            ...auxShow.current,
                            [res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].answered_form,
                        };
                    } else if (res.object.section[i].fields[f].type === "DATETIME") {
                        objToSend.current = {
                            ...objToSend.current,
                            ["field_" + res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].answered_form,
                        };
                        auxShow.current = {
                            ...auxShow.current,
                            [res.object.section[i].fields[f].form_section_field_id]:
                                res.object.section[i].fields[f].answered_form === "" ? "" :
                                    moment(res.object.section[i].fields[f].answered_form).format("L") + res.object.section[i].fields[f].answered_form.substr(10),
                        };
                    } else if (res.object.section[i].fields[f].type === "DATE") {
                        objToSend.current = {
                            ...objToSend.current,
                            ["field_" + res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].answered_form,
                        };
                        auxShow.current = {
                            ...auxShow.current,
                            [res.object.section[i].fields[f].form_section_field_id]:
                                res.object.section[i].fields[f].answered_form === "" ? "" :
                                    moment(res.object.section[i].fields[f].answered_form).format("L"),
                        };
                    } else if (res.object.section[i].fields[f].type === "SELECT"
                        || res.object.section[i].fields[f].type === "RADIO") {
                        for (let o = 0; o < res.object.section[i].fields[f].options.length; o++) {
                            if (res.object.section[i].fields[f].options[o].selected) {
                                objToSend.current = {
                                    ...objToSend.current,
                                    ["field_" + res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].options[o].form_section_field_option_id,
                                };
                                auxShow.current = {
                                    ...auxShow.current,
                                    [res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].options[o].answer,
                                };
                            }
                        }
                    } else if (res.object.section[i].fields[f].type === "CHECKBOX") {
                        for (let o = 0; o < res.object.section[i].fields[f].options.length; o++) {
                            if (res.object.section[i].fields[f].options[o].selected) {
                                objToSend.current = {
                                    ...objToSend.current,
                                    ["field_" + res.object.section[i].fields[f].form_section_field_id + "_" + o]: res.object.section[i].fields[f].options[o].answer,
                                };
                                auxShow.current = {
                                    ...auxShow.current,
                                    [res.object.section[i].fields[f].form_section_field_id + "_" + o]: res.object.section[i].fields[f].options[o].answer,
                                };
                            }
                        }
                    }
                }
            }
            setObjToShow(auxShow.current);
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

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await api.post(`app/enrollment/${props.item.enrollment_id}/form/${props.form_id}`, objToSend.current);

            navigation.pop(2);
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

        }
        setLoading(false)
    };

    const handleChange = (name, e, options) => {
        setLoadingData(true);
        if (options) {


            for (let i = 0; i < options.length; i++) {
                objToSend.current = {...objToSend.current, [name.substr(0, 9) + i]: ""};
                setObjToShow({...objToShow, [name.substr(6, 3) + i]: ""});
            }
            objToSend.current = {...objToSend.current, [name]: e};
            setObjToShow({...objToShow, [name.substr(6)]: e});


        } else if (name.includes("note")) {
            objToSend.current = {...objToSend.current, [name]: e};
            setObjToShow({...objToShow, [name]: e});

        } else {
            objToSend.current = {...objToSend.current, [name]: e};
            setObjToShow({...objToShow, [name.substr(6)]: e});

        }

        setLoadingData(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            getData();

        }, []),
    );

    useEffect(() => {
        const backAction = () => {
            navigation.pop(2);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction,
        );

        return () => backHandler.remove();
    }, []);


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
                        {/*    backgroundColor={Colors.primary}*/}
                        {/*    barStyle="light-content"*/}
                        {/*/>*/}

                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop(2)}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: Texts.title,}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle,}}> {data?.form.title} </Text>
                            </View>
                            <TouchableOpacity style={{alignItems: "flex-end", justifyContent: "center"}}
                                              onPress={() => handleSave()}>
                                {loading?
                                    <ActivityIndicator size="small" color={'white'} />
                                :
                                    <AntIcon style={{marginRight: 10}} name={"check"} size={30} color={"white"}/>
                                }
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{elevation: 5}}>


                            <View style={{padding: 5}}>
                                {/*------------- Início do Form -------------*/}
                                {data?.section.map((item, index) =>
                                    <View style={{}} key={index}>
                                        <View style={{
                                            borderRadius: 15,
                                            elevation: 3,
                                            padding: 15,
                                            marginVertical: 10,
                                            backgroundColor: "white",
                                        }}>

                                            <Text style={{fontWeight: "bold", fontSize: 15}}>{item.description}</Text>
                                            <View style={styles.cardContent}>
                                                {/*------------- Início dos Fields -------------*/}
                                                {item?.fields.map((field, ind) =>
                                                    <View key={ind}>
                                                        {field.type === "TEXT" ?
                                                            <>
                                                                <View style={styles.item}>
                                                                    <Field2
                                                                        label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                        placeholder={field.label}
                                                                        value={objToShow?.[field.form_section_field_id]}
                                                                        change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                                                    />
                                                                </View>
                                                            </>
                                                            :
                                                            <>
                                                                {field.type === "TEXTAREA" ?
                                                                    <>
                                                                        <View style={styles.item}>
                                                                            <Field2
                                                                                label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                                multiline={1}
                                                                                value={objToShow?.[field.form_section_field_id]}
                                                                                change={(e) => handleChange("field_" + field.form_section_field_id, e)}
                                                                            />
                                                                        </View>

                                                                    </>
                                                                    :
                                                                    <>
                                                                        {field.type === "RADIO" ?
                                                                            <>
                                                                                <View style={styles.item}>
                                                                                    <View style={{flex: 1}}>
                                                                                        <SelectField2
                                                                                            label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                                            initialValue={objToShow?.[field.form_section_field_id]}
                                                                                            placeholder={field.answered_form !== "" ? field.answered_form  : "Selecione..."}
                                                                                            list={field.options}
                                                                                            change={(e) => handleChange("field_" + field.form_section_field_id, e.form_section_field_option_id)}
                                                                                        />
                                                                                    </View>
                                                                                    {field.note_enable &&
                                                                                    <View style={styles.item}>
                                                                                        <Field2
                                                                                            label={field.note_description}
                                                                                            multiline={1}
                                                                                            placeholder={field.answered_note}
                                                                                            value={objToShow?.["note_" + field.form_section_field_id]}
                                                                                            change={(e) => handleChange("note_" + field.form_section_field_id, e)}

                                                                                        />
                                                                                    </View>
                                                                                    }
                                                                                </View>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {field.type === "SELECT" ?
                                                                                    <>


                                                                                        <View style={styles.item}>
                                                                                            <View style={{flex: 1}}>
                                                                                                <SelectField2
                                                                                                    label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                                                    initialValue={objToShow?.[field.form_section_field_id]}
                                                                                                    placeholder={field.answered_form !== "" ? field.answered_form  : "Selecione..."}
                                                                                                    list={field.options}
                                                                                                    change={(e) => handleChange("field_" + field.form_section_field_id, e.form_section_field_option_id)}
                                                                                                />

                                                                                            </View>
                                                                                            {field.note_enable &&
                                                                                            <View style={styles.item}>
                                                                                                <Field2
                                                                                                    label={field.note_description}
                                                                                                    multiline={1}
                                                                                                    value={objToShow?.["note_" + field.form_section_field_id]}
                                                                                                    change={(e) => handleChange("note_" + field.form_section_field_id, e)}

                                                                                                />
                                                                                            </View>
                                                                                            }
                                                                                        </View>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        {field.type === "CHECKBOX" ?
                                                                                            <>
                                                                                                <View
                                                                                                    style={styles.item}>
                                                                                                    <Text
                                                                                                        style={[styles.title, {flex: 1}]}>{field.label}{field.mandatory ? "*" : ""}</Text>
                                                                                                    <View
                                                                                                        style={{flex: 1}}>
                                                                                                        {field.options.map((opt, pos) =>
                                                                                                            <View
                                                                                                                key={pos}
                                                                                                                style={{
                                                                                                                    margin: 10,
                                                                                                                    marginTop: 5,
                                                                                                                    marginBottom: 0
                                                                                                                }}>
                                                                                                                {Platform.OS !== "ios" ?
                                                                                                                    <View
                                                                                                                        style={{
                                                                                                                            flexDirection: "row",
                                                                                                                            alignItems: "center",
                                                                                                                            borderColor: objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.selectedBorder : Colors.lightgray,
                                                                                                                            backgroundColor: objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.selected : "#f9f9f9",
                                                                                                                            borderWidth: 1,
                                                                                                                            borderRadius: 10,
                                                                                                                            padding: 10,
                                                                                                                        }}>
                                                                                                                        <Checkbox
                                                                                                                            color={Colors.primary}
                                                                                                                            status={objToShow?.[field.form_section_field_id + "_" + pos] ? "checked" : "unchecked"}
                                                                                                                            onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                                                                                ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                                                                                : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}/>
                                                                                                                        <TouchableOpacity
                                                                                                                            style={{flex: 1}}
                                                                                                                            onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                                                                                ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                                                                                : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}>
                                                                                                                            <Text
                                                                                                                                style={{
                                                                                                                                    fontSize: 14,
                                                                                                                                    maxWidth: "100%",
                                                                                                                                }}> {opt.answer}</Text>
                                                                                                                        </TouchableOpacity>
                                                                                                                    </View>

                                                                                                                    :
                                                                                                                    <>
                                                                                                                        <View
                                                                                                                            style={{
                                                                                                                                flexDirection: "row",
                                                                                                                                alignItems: "center",
                                                                                                                                borderColor: objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.selectedBorder : Colors.lightgray,
                                                                                                                                backgroundColor: objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.selected : "#f9f9f9",
                                                                                                                                borderWidth: 1,
                                                                                                                                borderRadius: 10,
                                                                                                                                padding: 10,
                                                                                                                            }}>
                                                                                                                            <View
                                                                                                                                style={{
                                                                                                                                    justifyContent: 'center',
                                                                                                                                    width: 35,
                                                                                                                                    height: 35,
                                                                                                                                    borderWidth: 0.5,
                                                                                                                                    borderRadius: 4,
                                                                                                                                    borderColor: Colors.lightgray
                                                                                                                                }}>
                                                                                                                                <Checkbox
                                                                                                                                    color={Colors.primary}
                                                                                                                                    status={objToShow?.[field.form_section_field_id + "_" + pos] ? "checked" : "unchecked"}
                                                                                                                                    onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                                                                                        ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                                                                                        : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}/>

                                                                                                                            </View>
                                                                                                                            <TouchableOpacity
                                                                                                                                style={{marginLeft: 10, flex: 1}}
                                                                                                                                onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                                                                                    ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                                                                                    : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}>
                                                                                                                                <Text
                                                                                                                                    style={{
                                                                                                                                        fontSize: 14,
                                                                                                                                        maxWidth: "100%",
                                                                                                                                        color: Colors.primary,
                                                                                                                                    }}>{opt.answer}
                                                                                                                                </Text>
                                                                                                                            </TouchableOpacity>
                                                                                                                        </View>
                                                                                                                    </>
                                                                                                                }
                                                                                                            </View>,
                                                                                                        )}
                                                                                                    </View>
                                                                                                </View>
                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                {field.type === "DATE" ?
                                                                                                    <>

                                                                                                        <View
                                                                                                            style={styles.item}>
                                                                                                            <Field2
                                                                                                                label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                                                                keyboardType={"number-pad"}
                                                                                                                placeholder={"00/00/0000"}
                                                                                                                value={objToShow?.[field.form_section_field_id] ? objToShow?.[field.form_section_field_id] : ""}
                                                                                                                change={(e) => handleChange(("field_" + field.form_section_field_id), maskDate(e))}
                                                                                                            />
                                                                                                        </View>
                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        {field.type === "TIME" ?
                                                                                                            <>

                                                                                                                <View
                                                                                                                    style={styles.item}>
                                                                                                                    <Field2
                                                                                                                        label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                                                                        keyboardType={"number-pad"}
                                                                                                                        placeholder={"00:00"}
                                                                                                                        value={maskHour(objToShow?.[field.form_section_field_id])}
                                                                                                                        change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                                                                                                    />
                                                                                                                </View>
                                                                                                            </>
                                                                                                            :
                                                                                                            <>
                                                                                                                {field.type === "FILE" ?
                                                                                                                    <>
                                                                                                                        {/*TODO*/}
                                                                                                                    </>
                                                                                                                    :
                                                                                                                    <>
                                                                                                                        {field.type === "DATETIME" ?
                                                                                                                            <>
                                                                                                                                <View
                                                                                                                                    style={{
                                                                                                                                        flex: 1,
                                                                                                                                        flexDirection: "row"
                                                                                                                                    }}>
                                                                                                                                    <View
                                                                                                                                        style={styles.item}>
                                                                                                                                        <Field2
                                                                                                                                            label={field.label + " " + [field.mandatory ? "*" : ""]}
                                                                                                                                            keyboardType={"number-pad"}
                                                                                                                                            placeholder={"00/00/0000 00:00"}
                                                                                                                                            value={objToShow?.[field.form_section_field_id] ? maskDateTime(objToShow?.[field.form_section_field_id]) : ""}
                                                                                                                                            change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                                                                                                                        />
                                                                                                                                    </View>
                                                                                                                                </View>
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
        margin: 5,
        borderRadius: 15,
        height: 120,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",

    },
    cardContent: {
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: Colors.backgroundDefault,
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 5,
        color: Colors.primary,
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
        flex: 1,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#d9dade",
        borderRadius: 5,
        padding: 8,
        marginVertical: 5,
    },
});
