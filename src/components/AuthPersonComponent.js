import React, { useState, useRef } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Text,
  TouchableOpacity, Modal,
} from "react-native";
import { Colors } from "../helpers/Colors";
import Toast from "../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../helpers/Texts";
import moment from "moment";
import { Avatar } from "react-native-paper";
import Field from "./Field";
import ButtonStyle1 from "./Buttons/ButtonStyle1";
import SelectField from "./SelectField";
import GeneralStatusBarColor from "./StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);

const optKinship = [
  { label: "Mãe", value: "MOTHER" },
  { label: "Pai", value: "FATHER" },
  { label: "Irmão(ã)", value: "BROTHER" },
  { label: "Tio(a)", value: "UNCLE" },
  { label: "Primo(a)", value: "COUSIN" },
  { label: "Avó", value: "GRANDMATERNAL" },
  { label: "Avô", value: "GRANDPATERNAL" },
  { label: "Bisavó", value: "GREATMATERNAL" },
  { label: "Bisavô", value: "GREATPATERNAL" },
  { label: "Outro", value: "OTHER" },
];

export function AuthPersonComponent(props, { navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const [data, setData] = useState(props.data);
  const [kinship, setKinship] = useState();
  const [name, setName] = useState();
  const [isVisible, setIsVisible] = useState(false)
  const [password, setPassword] = useState()

  const confirm = async () => {
    setIsVisible(false)
    const objToSend = {
      kinship: kinship,
      name: name,
      password: password,
    };
    setPassword('')
    try {
      const res = await api.post(`app/enrollment/${props.id}/auth-person`, objToSend);

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

  useFocusEffect(
    React.useCallback(() => {
    }, []),
  );

  return (
    <View style={styles.container}>
      <GeneralStatusBarColor backgroundColor={Colors.theme}
                             barStyle="light-content"/>
      {/*<StatusBar*/}
      {/*  backgroundColor={Colors.theme}*/}
      {/*  barStyle="light-content"*/}
      {/*/>*/}
      <Toast ref={refNotification} />
      <View style={{ flexDirection: "row", backgroundColor: Colors.theme, padding: 20 }}>
        <TouchableOpacity style={{   }} onPress={() => props.close(false)}>
          <AntIcon name={"arrowleft"} style={{}} size={25} color={"white"} />
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'center',paddingLeft: 10}}>

          <Text style={{ color: "white", fontSize: 23, }}>Construindo o Saber</Text>
          <Text style={{ color: "white", fontSize: Texts.subtitle, }}>Responsável retirada </Text>

        </View>
        <TouchableOpacity style={{  marginTop: 10, alignItems: "flex-end" }}
                          onPress={() => setIsVisible(true)}>

        </TouchableOpacity>
      </View>
      <View style={{
        padding: 20,
        display: "flex",
        justifyContent: "space-between",
      }}>

        <View>
          <SelectField icon={"people-outline"} label={"Parentesco"}
                       placeholder={"Selecione o parentesco"}
                       list={optKinship}
                       change={(e) => setKinship(e)} />
        </View>

        <Field
          placeholder="Nome"
          label={"Nome"}
          value={name}
          change={(e) => setName(e)}
          icon={"person-outline"}
        />
        <View style={{ display: "flex", paddingHorizontal: 10 }}>
          <ButtonStyle1
            text={"Adicionar"}
            style={{ margin: 3, padding: 8 }}
            loading={loading}
            primaryColor={Colors.theme}
            secondaryColor={Colors.theme}
            color={Colors.white}
            borderRadius={15}
            onPress={() =>
              setIsVisible(true)
            }
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          confirm(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <Text style={{ fontSize: Texts.listTitle, fontWeight: 'bold', textAlign: "center", marginBottom: 10 }}> Digite sua senha para confirmar </Text>

            <Field
              placeholder="Sua Senha"
              secureTextEntry={true}
              value={password}
              change={(e) => setPassword(e)}
              icon={"key"}
            />
            <View style={{ flexDirection: "row" }}>

              <ButtonStyle1
                text={"Cancelar"}
                style={{ margin: 3, padding: 8 }}
                loading={loading}
                primaryColor={Colors.pendingBorder}
                secondaryColor={Colors.pendingBorder}
                color={Colors.white}
                borderRadius={15}
                onPress={() => {
                  setIsVisible(false);
                }}
              />
              <ButtonStyle1
                text={"Confirmar"}
                style={{ margin: 3, padding: 8 }}
                loading={loading}
                primaryColor={'#014763'}
                secondaryColor={'#014763'}
                color={Colors.white}
                borderRadius={15}
                onPress={() => {
                  confirm();
                }}
              />
            </View>
          </View>
        </View>


      </Modal>

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
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: Colors.primary,
  },
  subTitle: {
    fontSize: 18,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  class: {
    fontSize: 20,
    color: "white",
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
});
