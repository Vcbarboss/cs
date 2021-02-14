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
  SafeAreaView,
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
import { maskViewPhone } from "../../helpers/Functions";
import useAuth from "../../hooks/Auth";
import Loading from "../../components/Loading";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import { Avatar } from "react-native-paper";

const screenHeight = Math.round(Dimensions.get("window").height);

export function ProfileScreen({ navigation }) {

  const [loading, setLoading] = useState(true);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const user = useSelector((state) => state).userReducer;
  const [data, setData] = useState();
  const { logoutWithoutApi } = useAuth();
  const [showButton, setShowButton] = useState(true);


  const getData = async () => {

    setLoading(true);
    try {
      const res = await api.get("app/me");
console.log(res)
      setData({
        name: res.object?.name,
        natural_birthday: res.object?.natural_birthday,
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


  const doLogout = async () => {
    try {
      const res = await api.get("app/logout");

    } catch (e) {
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
    }
    logoutWithoutApi();
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen", params: { order: 0 } }],
    });
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
                <Text style={{ color: "white", fontSize: Texts.subtitle, }}>Perfil </Text>
              </View>
              <TouchableOpacity style={{ alignItems: "flex-end", justifyContent: "center" }}
                                onPress={() => navigation.navigate("EditScreen")}>
                <AntIcon style={{ marginRight: 10 }} name={"edit"} size={30} color={"white"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ backgroundColor: "#fcfcfc",}} >
              <View style={{
                alignItems: "center",
                margin: 10,
                backgroundColor: "#fcfcfc",

              }}>
                <Avatar.Image size={120} source={{ uri: data.avatar }} />

              </View>
              <View style={styles.item}>
                <Text style={styles.title}>Nome: </Text>
                <Text style={styles.subtitle}>{data?.name}</Text>
              </View>
                <View style={styles.item}>
                  <Text style={styles.title}>Idade: </Text>
                  <Text style={styles.subtitle}>{moment().diff(data?.natural_birthday, "years")} </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>Data de Nascimento: </Text>
                  <Text style={styles.subtitle}>{moment(data?.natural_birthday).format("L")} </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>Gênero: </Text>
                  <Text style={styles.subtitle}>{data?.natural_gender} </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>Telefone Residencial: </Text>
                  <Text
                    style={styles.subtitle}>{data?.contact_home_phone ? maskViewPhone(data?.contact_home_phone) : "Nenhum"} </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>Telefone Celular: </Text>
                  <Text
                    style={styles.subtitle}>{data?.contact_mobile_phone ? maskViewPhone(data?.contact_mobile_phone) : "Nenhum"} </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>Email: </Text>
                  <Text style={styles.subtitle}>{data?.contact_mail ? data?.contact_mail : "Nenhum"} </Text>
                </View>

                <View  style={styles.item}>
                  <Text style={styles.title}>Telefone de Trabalho: </Text>
                  <Text
                    style={styles.subtitle}>{data?.contact_business_phone ? maskViewPhone(data?.contact_business_phone) : "Nenhum"} </Text>
                </View>

            </ScrollView>
          </View>
        )}
    </>

  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Texts.listTitle,
    fontWeight: "bold",
    marginVertical: 5,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Texts.listDescription,
    color: Colors.primary,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#d9dade",
    backgroundColor: "#fcfcfc",
  },
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "white",
  },
});
