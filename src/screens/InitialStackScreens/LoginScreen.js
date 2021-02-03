import React, { useState, useRef } from "react";
import { Image, StatusBar, StyleSheet, View, ImageBackground, ScrollView, Dimensions, Text } from "react-native";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import { Colors } from "../../helpers/Colors";
import Field from "../../components/Field";
import Toast from "../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import logo from "../../assets/imgs/construindo-o-saber-full.fw.png";
import useApi from "../../hooks/Api";
import useAuth from "../../hooks/Auth";
import {maskCpf} from "../../helpers/Functions";
import {Env} from "../../Env";

const screenHeight = Math.round(Dimensions.get("window").height);

export function LoginScreen({ navigation }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const { login, getFcmToken } = useAuth();
  const refNotification = useRef();
  const [showButton, setShowButton] = useState(true);
  let fcm = "";

  const doAfterLogin = async (res) => {
    const token = res.userToken;
    await login(res, token);
    setLoading(false);
    navigation.reset({ index: 0, routes: [{ name: "LoadingScreen" }] });
  };

  const doLogin = async () => {
    setLoading(true);

    fcm = await getFcmToken();

    const objToSend = {
      password: password,
      login: username.replace(/[^0-9]/g, ""),
      identifier: Env.identifier, //Dev - AADBA381-EECB-434A-B9B8-656FE3227274 //Prod 2BFE1A53-E618-4ACC-9180-ED7F370B4E54
      firebase_token: fcm,
    };

    try {
      const res = await api.post("app/auth", objToSend);
      console.log(res)
      if (res.HTTPStatus ===  401) {
        refNotification.current.showToast("warning", "CPF ou Senha incorretos!");
        setLoading(false);
      } else {
        doAfterLogin(res);
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

  const checkLogin = async () => {
    if (username && password) {
      doLogin();
    } else {
      refNotification.current.showToast("warning", "Informe seu Usuário e Senha", "Informe seu usuário e senha");
    }

  };


  useFocusEffect(
    React.useCallback(() => {

    }, []),
  );

  return (
    <View style={styles.container}>

      <Toast ref={refNotification} />

      <StatusBar
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />
      <View style={{ alignItems: "center", flex: 1, maxHeight: 250 }}>
        <Image source={logo} style={styles.logo} />
      </View>
      <ScrollView style={{ display: "flex" }}>
        <View style={{
          flex: 1, display: "flex",
          backgroundColor: "white",
          justifyContent: "space-around",
        }}>
          <View>
            <View>
              <Text style={{ fontSize: 30, color: Colors.primary, fontWeight: "bold", marginBottom: 20 }}>
                Entrar
              </Text>
            </View>
            <Field
              placeholder="CPF"
              keyboardType={'number-pad'}
              label={"CPF"}
              value={maskCpf(username)}
              change={(e) => setUsername(e)}
              icon={"person"}
            />

            <Field
              placeholder="Sua Senha"
              label={"Senha"}
              secureTextEntry={true}
              value={password}
              change={(e) => setPassword(e)}
              icon={"key"}
              // anyComponent={
              //     <TouchableOpacity onPress={() => navigation.navigate("ForgotScreen")} style={{
              //         alignItems: "flex-end",
              //         marginTop: -20,
              //         zIndex: 100,
              //         padding: 10,
              //         marginBottom: -10,
              //     }}>
              //         <Text style={{color: Colors.primary, marginRight: 5}}> Esqueceu? </Text>
              //     </TouchableOpacity>
              // }
            />
          </View>
          {(showButton || screenHeight >= 600) &&
          <View style={{ display: "flex", justifyContent: "flex-end" }}>
            <ButtonStyle1
              text={"Entrar"}
              style={{ margin: 3, padding: 8 }}
              loading={loading}
              primaryColor={Colors.primary}
              secondaryColor={Colors.primary}
              color={"white"}
              borderRadius={15}
              onPress={() => {
                checkLogin();

              }}
            />
          </View>}
        </View>
      </ScrollView>
    </View>

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
    padding: 16,
    display: "flex",
    backgroundColor: "white",
    justifyContent: "space-around",
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
});
