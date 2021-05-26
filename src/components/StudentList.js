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
  ActivityIndicator,
} from "react-native";
import { Colors } from "../helpers/Colors";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../helpers/Texts";
import Toast from "./Toast";
import image from "../assets/imgs/userStudent.png";
import Loading from "./Loading";
import { Avatar, Badge } from "react-native-paper";
import { Env } from "../Env";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);


const StudentList = React.forwardRef((props, ref) => {

  const [loading, setLoading] = useState(false);
  const nav = props.navigation;
  const api = useApi({ nav });
  const refNotification = useRef();
  const [list, setList] = useState([]);
  const [badge, setBadge] = useState();

  const getApi = async () => {
    if (props.refresh === false) {
      setLoading(true);
      try {
        const res = await api.get("app/enrollment/list");
        setList(res.object);
      } catch (e) {
        let aux;
        for (let i = 0; i < Object.keys(e.validator).length; i++) {
          aux = e.validator[Object.keys(e.validator)[i]][0];
          break;
        }
        refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

      }
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getApi();
    }, [props.refresh]),
  );

  return (
    <>
      {loading ? (
          // <Loading />
          <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", height: 200 }}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "bold", color: Colors.primary }}>Carregando
              alunos </Text>
          </View>
        )
        :
        (
          <View style={props.style}>
            {list.map((item, index) =>
              <View style={{}} key={index}>
                {
                  item.student.person.active ?
                    <TouchableOpacity key={index}
                                      style={[styles.itemList, { backgroundColor: item.student.person.natural_gender === "FEMININO" ? Colors.pink : Colors.opt1 }]}
                                      onPress={() => {
                                        // Colors.primary = item.student.person.natural_gender === "FEMININO" ? Colors.pink : Colors.opt1;
                                        props.navigation.navigate("StudentStack", {
                                          item: item,
                                        });
                                      }}>


                      <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20, paddingVertical: 10 }}>
                        {/*<View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>*/}
                        {/*  <View style={{*/}
                        {/*    alignItems: "center",*/}
                        {/*    justifyContent: "center",*/}
                        {/*    backgroundColor: Colors.opt1,*/}
                        {/*    borderRadius: 50,*/}
                        {/*    width: 60,*/}
                        {/*    height: 60,*/}
                        {/*  }}>*/}
                        {/*    <AntIcon name={"idcard"} style={{}} size={35} color={"white"} />*/}
                        {/*  </View>*/}
                        {/*</View>*/}
                        <View style={{ flex: 1, padding: 5 }}>
                          <View style={{ flex: 1, padding: 5 }}>
                            <Text style={styles.title}>{item.student.person.name} </Text>
                          </View>
                          <View style={{ flex: 1, padding: 5, justifyContent: "flex-end" }}>
                            <Text style={styles.subtitle}>{item.class_room.description}</Text>
                          </View>
                        </View>
                        <View style={{ flex: 0.5, alignItems: "flex-end", justifyContent: "center" }}>
                          {/*<AntIcon name={"right"} style={{}} size={40} color={Colors.primary} />*/}
                          {item.push_notification_recipients_count > 0 &&
                          <Badge size={25} style={{
                            position: "absolute",
                            top: -5,
                            right: -10,
                            zIndex: 10,
                          }}>{item.push_notification_recipients_count}</Badge>}
                          {item.student.person.avatar ?
                              <Avatar.Image size={screenWidth*0.30} source={{ uri: item.student.person.avatar }} />
                              :
                              <Image source={image} style={styles.img} />
                          }
                        </View>
                      </View>
                    </TouchableOpacity>
                    :
                    <>
                    </>
                }
              </View>,
            )}
          </View>
        )
      }
    </>
  );
});

export default StudentList;

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: Texts.title,
    fontWeight: "bold",

  },
  subtitle: {
    color: "white",
    fontSize: Texts.subtitle,
  },
  img: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    flex: 1,
  },
  itemList: {
    flex: 1,
    marginVertical: 8,
    borderRadius: 10,// tirei a altura fixa
    elevation: 3,
  },
});
