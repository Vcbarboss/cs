import React, { useState, useRef } from "react";
import { Image, StatusBar, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Text } from "react-native";
import { Colors } from "../../helpers/Colors";
import Toast from "../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../../helpers/Texts";
import moment from "moment";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";

const screenHeight = Math.round(Dimensions.get("window").height);

export function NotificationScreen({ navigation }) {

  const [loading, setLoading] = useState(true);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const [data, setData] = useState();
  const dispatch = useDispatch();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`app/notification/${props.id}`);
      setData(res);
      dispatch({type: 'delete_notification'});
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
            <StatusBar
              backgroundColor={Colors.primary}
              barStyle="light-content"
            />
            <View style={{ backgroundColor: Colors.primary }}>
              <View style={{ flexDirection: "row", marginHorizontal: 10, height: 70 }}>
                <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => navigation.pop()}>
                  <AntIcon name={"arrowleft"} style={{}} size={35} color={"white"} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "white", fontSize: Texts.header, textAlign: "center" }}> Notificações </Text>
                </View>
                <TouchableOpacity style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>

                </TouchableOpacity>
              </View>
            </View>
            <ScrollView>
              <View style={{ backgroundColor: "white" }} onPress={() => navigation.navigate("StudentScreen")}>
                <View style={{ flex: 1, marginHorizontal: 20 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{
                      fontSize: 25,
                      fontWeight: "bold",
                      marginVertical: 20,
                      textAlign: "center",
                      color: "#006466",
                    }}>{data?.object.push_notification.title}</Text>
                    <Text
                      style={{
                        fontSize: Texts.subtitle,
                        color: "#006466",
                      }}>{data?.object.push_notification.message}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{
                      fontSize: 13,
                      marginVertical: 20,
                      color: Colors.lightgray,
                    }}>{moment(data?.object.created_at.substr(0, 10)).format("L")} {data?.object.created_at.substr(11, 5)}</Text>

                  </View>

                </View>
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
});
