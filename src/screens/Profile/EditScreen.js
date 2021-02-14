import React, { useState, useRef } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
  SafeAreaView
} from "react-native";
import { Colors } from "../../helpers/Colors";
import Toast from "../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../../helpers/Texts";
import { useSelector } from "react-redux";
import { Env } from "../../Env";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import moment from "moment";
import "moment/locale/pt-br";
import Field from "../../components/Field";
import { maskDate, maskDate2, maskPhone, maskViewPhone } from "../../helpers/Functions";
import SelectField from "../../components/SelectField";
import Loading from "../../components/Loading";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import { launchImageLibrary } from "react-native-image-picker";
import IonIcon from "react-native-vector-icons/Ionicons";
import ImgToBase64 from 'react-native-image-base64';
import { Avatar } from "react-native-paper";

const screenHeight = Math.round(Dimensions.get("window").height);

const optGender = [
  { label: "Selecione seu gênero...", value: null },
  { label: "Masculino", value: "MASCULINO" },
  { label: "Feminino", value: "FEMININO" },
];

export function EditScreen({ navigation }) {

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState()
  const api = useApi({ navigation });
  const refNotification = useRef();
  const user = useSelector((state) => state).userReducer;
  const [data, setData] = useState();
  const [edit, setEdit] = useState();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get("app/me");
      setData({
        natural_birthday: moment(res.object?.natural_birthday).format("L"),
        natural_gender: res.object?.natural_gender,
        contact_business_phone: res.object?.contact_business_phone,
        contact_home_phone: res.object?.contact_home_phone,
        contact_mobile_phone: res.object?.contact_mobile_phone,
        contact_mail: res.object?.contact_mail,
      });
      setEdit({
        natural_birthday: moment(res.object?.natural_birthday).format("L"),
        natural_gender: res.object?.natural_gender,
        contact_business_phone: res.object?.contact_business_phone,
        contact_home_phone: res.object?.contact_home_phone,
        contact_mobile_phone: res.object?.contact_mobile_phone,
        contact_mail: res.object?.contact_mail,
        avatar: res.object?.avatar
      });
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

  const handleChange = (name, e) => {
    if (name.includes("phone")) {
      setEdit({ ...edit, [name]: e.replace(/\D/g, "") });
      setData({ ...edit, [name]: e.replace(/\D/g, "") });

    } else {
      setEdit({ ...edit, [name]: e });
      setData({ ...edit, [name]: e });
    }
  };

  const handleEdit = async () => {

    try {
      console.log(edit)
      const res = await api.put("app/me", edit);
      console.log(res)
      console.log(edit)
      navigation.pop();
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
          <Loading />

        )
        :
        (
          <View style={styles.container}>
            <Toast ref={refNotification} />
            <GeneralStatusBarColor backgroundColor={Colors.primary}
                                   barStyle="light-content"/>
            {/*<StatusBar*/}
            {/*  backgroundColor={Colors.primary}*/}
            {/*  barStyle="light-content"*/}
            {/*/>*/}
            <View style={{ flexDirection: "row", backgroundColor: Colors.primary, padding: 20 }}>
              <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>

                <Text style={{ color: "white", fontSize: 23, }}>Construindo o Saber</Text>
                <Text style={{ color: "white", fontSize: Texts.subtitle, }}>Editar perfil  </Text>
              </View>
              <TouchableOpacity style={{ marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center" }}
                                onPress={() =>{}}>
                <IonIcon name={"camera-outline"} style={{ marginTop: 10 }} size={27} color={'white'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ paddingHorizontal: 15 }}>
              <View style={{
                paddingHorizontal: 10,
                display: "flex",
                justifyContent: "space-between",
              }}>
                <View style={{
                  alignItems: "center",
                  margin: 10,
                  marginBottom: 30
                }}>
                  <TouchableOpacity onPress={ () =>
                    launchImageLibrary(
                      {
                        mediaType: 'photo',
                        includeBase64: true,

                      },
                      (response) => {
console.log(response)
                        if(response.uri){
                          setEdit({ ...edit, [`avatar`]: response.uri })
                        }
                        setResponse(response);
                        ImgToBase64.getBase64String(response.uri)
                          .then(base64String =>   setEdit({ ...edit, [`avatar_base64`]: base64String }))
                          .catch(err =>console.log(err));


                      },
                    )
                  }>
                    <Avatar.Image size={120} source={{ uri: edit?.avatar }} />
                  </TouchableOpacity>

                </View>
                <View>
                  <Field
                    icon={"calendar-outline"}
                    keyboardType={"number-pad"}
                    placeholder={"Sua data de nascimento"}
                    value={edit?.natural_birthday ? maskDate(edit?.natural_birthday) : maskDate(data?.natural_birthday)}
                    label={"Data de Nascimento"}
                    change={(e) => handleChange("natural_birthday", e)} />
                </View>
                <View>
                  <SelectField icon={"male-female"} label={"Gênero"}
                               initialValue={edit?.natural_gender ? edit?.natural_gender : data?.natural_gender}
                               placeholder={edit?.natural_gender ? edit?.natural_gender : data?.natural_gender}
                               list={optGender}
                               change={(e) => handleChange("natural_gender", e)} />
                </View>
                <View>
                  <Field
                    icon={"home-outline"}
                    keyboardType={"number-pad"}
                    placeholder={"Seu telefone residencial"}
                    value={edit?.contact_home_phone ? maskPhone(edit?.contact_home_phone) : maskPhone(data?.contact_home_phone)}
                    label={"Telefone Residencial"}
                    change={(e) => handleChange("contact_home_phone", e)} />
                </View>
                <View>
                  <Field
                    icon={"call-outline"}
                    keyboardType={"number-pad"}
                    placeholder={"Seu telefone celular"}
                    value={edit?.contact_mobile_phone ? maskPhone(edit?.contact_mobile_phone) : maskPhone(data?.contact_mobile_phone)}
                    label={"Telefone Celular"}
                    change={(e) => handleChange("contact_mobile_phone", e)} />
                </View>
                <View>
                  <Field
                    icon={"mail-outline"}
                    placeholder={"Seu Email"}
                    value={edit?.contact_mail ? edit?.contact_mail : data?.contact_mail}
                    label={"Seu email"}
                    change={(e) => handleChange("contact_mail", e)} />
                </View>

                <View>
                  <Field
                    icon={"business"}
                    keyboardType={"number-pad"}
                    placeholder={"Seu Telefone de Trabalho"}
                    value={edit?.contact_business_phone ? maskPhone(edit?.contact_business_phone) : maskPhone(data?.contact_business_phone)}
                    label={"Telefone de Trabalho"}
                    change={(e) => handleChange("contact_business_phone", e)} />
                </View>


              </View>
            </ScrollView>
            <View style={{ display: "flex", paddingHorizontal: 10 }}>
              <ButtonStyle1
                text={"Confirmar"}
                style={{ margin: 3, padding: 8 }}
                loading={loading}
                primaryColor={Colors.primary}
                secondaryColor={Colors.primary}
                color={'white'}
                borderRadius={15}
                onPress={() => {
                  handleEdit();
                }}
              />
            </View>
          </View>
        )}
    </>

  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: Colors.primary,
  },
  subTitle: {
    fontSize: 19,
    marginBottom: 5,
  },
});
