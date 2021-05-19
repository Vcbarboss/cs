import React, { useState, useRef, useEffect } from "react";
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
  BackHandler,
} from "react-native";
import { Colors } from "../helpers/Colors";
import Toast from "../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../components/Loading";
import Field2 from "../components/Field2";
import SelectField2 from "./SelectField2";
import SelectField from "./SelectField";
import { maskDate, maskDateTime, maskHour } from "../helpers/Functions";
import moment from "moment";
import { Checkbox, Switch } from "react-native-paper";
import { Texts } from "../helpers/Texts";

const screenHeight = Math.round(Dimensions.get("window").height);

export function FormEditComponent(props, { navigation }) {

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState();
  const objToSend = useRef();
  const auxShow = useRef();
  const [objToShow, setObjToShow] = useState();
  const api = useApi({ navigation });
  const refNotification = useRef();

  const getData = async () => {
    //setLoading(true);

    // const obj = {
    //   field_6 : 'Vinicius Barbosa', // resposta --- 6 = form_section_field_id
    //   note_6 : 'observacao', // quando tiver note
    //   field_6_index: '' // quando for checkbox concatenar com o indice da resposta no array
    //   RADIO E SELECT = 1 OPCAO APENAS
    //   CHECKBOX = PODE TER MAIS DE 1
    // }
    try {
      const res = await api.get(`app/enrollment/${props.id}/form-student/${props.data.form_id}`);
      setData(res.object);
      setLoading(false);

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
              [res.object.section[i].fields[f].form_section_field_id]: moment(res.object.section[i].fields[f].answered_form).format("L") + res.object.section[i].fields[f].answered_form.substr(10),
            };
          } else if (res.object.section[i].fields[f].type === "DATE") {
            objToSend.current = {
              ...objToSend.current,
              ["field_" + res.object.section[i].fields[f].form_section_field_id]: res.object.section[i].fields[f].answered_form,
            };
            auxShow.current = {
              ...auxShow.current,
              [res.object.section[i].fields[f].form_section_field_id]: moment(res.object.section[i].fields[f].answered_form).format("L"),
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
    try {
      const res = await api.post(`app/enrollment/${props.id}/form-student/${props.data.form_id}`, objToSend.current);
      props.close(false);
    } catch (e) {
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

    }
  };

  const handleChange = (name, e, options) => {
    setLoadingData(true);
    if (options) {

      if (name.includes("note")) {
        objToSend.current = { ...objToSend.current, [name]: e };
        setObjToShow({ ...objToShow, [name]: e });

      } else {

        for (let i = 0; i < options.length; i++) {
          objToSend.current = { ...objToSend.current, [name.substr(0, 9) + i]: "" };
          setObjToShow({ ...objToShow, [name.substr(6, 3) + i]: "" });
        }
        objToSend.current = { ...objToSend.current, [name]: e };
        setObjToShow({ ...objToShow, [name.substr(6)]: e });
      }

    } else {
      objToSend.current = { ...objToSend.current, [name]: e };
      setObjToShow({ ...objToShow, [name.substr(6)]: e });

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
      props.close(false);
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
          <Loading />

        )
        :
        (
          <SafeAreaView style={styles.container}>
            <Toast ref={refNotification} />
            <StatusBar
              backgroundColor={Colors.primary}
              barStyle="light-content"
            />

            <View style={{ flexDirection: "row", backgroundColor: Colors.primary, padding: 10, paddingTop: 0 }}>
              <TouchableOpacity style={{}} onPress={() => props.close(false)}>
                <AntIcon name={"arrowleft"} style={{}} size={25} color={"white"} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
                <Text style={{ color: "white", fontSize: Texts.header }}> {data?.form.title} </Text>
              </View>
              <TouchableOpacity style={{ alignItems: "flex-end", justifyContent: "center" }}
                                onPress={() => handleSave()}>
                <AntIcon style={{ marginRight: 10 }} name={"check"} size={30} color={"white"} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ elevation: 5 }}>


              <View style={{ padding: 5 }}>
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

                      <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.description}</Text>
                      <View style={styles.cardContent}>
                        {/*------------- Início dos Fields -------------*/}
                        {item?.fields.map((field, ind) =>
                          <View key={ind}>
                            {field.type === "TEXT" ?
                              <>
                                <View style={styles.item}>
                                  <Text
                                    style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>

                                  <View style={{ flex: 1 }}>
                                    <Field2
                                      value={objToShow?.[field.form_section_field_id]}
                                      change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                    />
                                  </View>
                                </View>
                              </>
                              :
                              <>
                                {field.type === "TEXTAREA" ?
                                  <>
                                    <View style={styles.item}>
                                      <Text
                                        style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>
                                      <View style={{ flex: 1 }}>
                                        <Field2
                                          multiline={1}
                                          value={objToShow?.[field.form_section_field_id]}
                                          change={(e) => handleChange("field_" + field.form_section_field_id, e)}
                                        />
                                      </View>
                                    </View>
                                  </>
                                  :
                                  <>
                                    {field.type === "RADIO" ?
                                      <>
                                        <View style={styles.item}>
                                          <Text
                                            style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>
                                          <View style={{ flex: 1 }}>
                                            <View style={{ flex: 1 }}>
                                              <SelectField2
                                                initialValue={objToShow?.[field.form_section_field_id]}
                                                placeholder={"Selecione..."}
                                                list={objToShow?.["note_" + field.form_section_field_id]}
                                                change={(e) => handleChange("note_" + field.form_section_field_id, e.form_section_field_option_id)}
                                              />
                                            </View>
                                          </View>
                                        </View>
                                      </>
                                      :
                                      <>
                                        {field.type === "SELECT" ?
                                          <>
                                            <View style={styles.item}>
                                              <Text
                                                style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>

                                              <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1 }}>

                                                  <SelectField2
                                                    initialValue={objToShow?.[field.form_section_field_id]}
                                                    placeholder={"Selecione..."}
                                                    list={field.options}
                                                    change={(e) => handleChange("field_" + field.form_section_field_id, e.form_section_field_option_id)}
                                                  />

                                                </View>
                                              </View>
                                            </View>
                                          </>
                                          :
                                          <>
                                            {field.type === "CHECKBOX" ?
                                              <>
                                                <View style={styles.item}>
                                                  <Text
                                                    style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>
                                                  <View style={{ flex: 1 }}>
                                                    {field.options.map((opt, pos) =>
                                                      <View key={pos}
                                                            style={{ margin: 10, marginTop: 5, marginBottom: 0 }}>
                                                        {Platform.OS !== "ios" ?
                                                          <View style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            borderColor: objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.selectedBorder : Colors.lightgray,
                                                            backgroundColor: objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.selected : "#f9f9f9",
                                                            borderWidth: 1,
                                                            borderRadius: 10,
                                                            padding: 10,
                                                          }}>
                                                            <Checkbox color={Colors.primary}
                                                                      status={objToShow?.[field.form_section_field_id + "_" + pos] ? "checked" : "unchecked"}
                                                                      onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                        ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                        : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)} />
                                                            <TouchableOpacity
                                                              onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}>
                                                              <Text style={{
                                                                fontSize: 12,
                                                                maxWidth: "100%",
                                                              }}> {opt.answer}</Text>
                                                            </TouchableOpacity>
                                                          </View>

                                                          :
                                                          <>
                                                            <View style={{ flexDirection: "row" }}>
                                                              <Switch
                                                                style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                                                                trackColor={{
                                                                  false: Colors.lightgray,
                                                                  true: "rgba(117,202,37,0.55)",
                                                                }}
                                                                thumbColor={objToShow?.[field.form_section_field_id + "_" + pos] ? Colors.secondary : "#bdbcbd"}
                                                                onValueChange={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                  ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                  : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}
                                                                value={objToShow?.[field.form_section_field_id + "_" + pos]}
                                                              />
                                                            </View>

                                                            <TouchableOpacity
                                                              onPress={() => objToShow?.[field.form_section_field_id + "_" + pos]
                                                                ? handleChange("field_" + field.form_section_field_id + "_" + pos, "")
                                                                : handleChange("field_" + field.form_section_field_id + "_" + pos, opt.answer)}>
                                                              <Text
                                                                style={{
                                                                  fontSize: 12,
                                                                  maxWidth: "100%",
                                                                  color: Colors.primary,
                                                                }}>{objToShow?.[field.form_section_field_id + "_" + pos]}
                                                              </Text>
                                                            </TouchableOpacity>
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
                                                    <View style={styles.item}>
                                                      <Text
                                                        style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>

                                                      <View style={{ flex: 1 }}>
                                                        <Field2
                                                          keyboardType={"number-pad"}
                                                          placeholder={"00/00/0000"}
                                                          value={objToShow?.[field.form_section_field_id] ? maskDate(objToShow?.[field.form_section_field_id]) : moment(field?.answered_form).format("L")}
                                                          change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                                        />
                                                      </View>
                                                    </View>
                                                  </>
                                                  :
                                                  <>
                                                    {field.type === "TIME" ?
                                                      <>
                                                        <View style={styles.item}>
                                                          <Text
                                                            style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>
                                                          <View style={{ flex: 1 }}>
                                                            <Field2
                                                              keyboardType={"number-pad"}
                                                              placeholder={"00:00"}
                                                              value={maskHour(objToShow?.[field.form_section_field_id])}
                                                              change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                                            />
                                                          </View>
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
                                                                <View style={styles.item}>
                                                                  <Text
                                                                    style={[styles.title, { flex: 1 }]}>{field.label}{field.mandatory ? "*" : ""}</Text>
                                                                  <View style={{ flex: 1, flexDirection: "row" }}>
                                                                    <View style={{ flex: 1 }}>
                                                                      <Field2
                                                                        keyboardType={"number-pad"}
                                                                        placeholder={"00/00/0000 00:00"}
                                                                        value={objToShow?.[field.form_section_field_id] ? maskDateTime(objToShow?.[field.form_section_field_id]) : ""}
                                                                        change={(e) => handleChange(("field_" + field.form_section_field_id), e)}
                                                                      />
                                                                    </View>
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
          </SafeAreaView>
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
    padding: 5,
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
