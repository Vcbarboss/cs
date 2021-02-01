import React, { useState, useRef } from "react";
import { Image, StatusBar, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Text } from "react-native";
import { Colors } from "../../helpers/Colors";
import Toast from "../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../../helpers/Texts";

const screenHeight = Math.round(Dimensions.get("window").height);

export function StudentListScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const [list, setList] = useState([]);

  const getApi = async () => {
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
  };

  useFocusEffect(
    React.useCallback(() => {
      getApi();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Toast ref={refNotification} />
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />
      <View style={{ backgroundColor: Colors.primary, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: "row", marginHorizontal: 10, height: 70 }}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => navigation.pop()}>
            <AntIcon name={"arrowleft"} style={{}} size={35} color={"white"} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: Texts.header, textAlign: "center" }}> Alunos </Text>
          </View>
          <TouchableOpacity style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>

          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        {list.map((item, index) =>
          <View key={index}>
          {
            item.student.person.active ?
                <TouchableOpacity key={index} style={styles.itemList}
                                  onPress={() => navigation.navigate("StudentScreen", {
                                    item: item,
                                  })}>

                  <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20, paddingVertical: 10 }}>
                    <View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>
                      <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Colors.opt1,
                        borderRadius: 50,
                        width: 60,
                        height: 60,
                      }}>
                        <AntIcon name={"idcard"} style={{}} size={35} color={"white"} />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
                        <Text style={styles.title}>{item.student.person.name}</Text>
                      </View>
                      <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
                        <Text style={styles.subtitle}>{item.class_room.description}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 0.5, alignItems: "flex-end", justifyContent: "center" }}>
                      <AntIcon name={"right"} style={{}} size={40} color={Colors.primary} />
                    </View>
                  </View>
                </TouchableOpacity>

              :
              <>
              </>
          }
          </View>,
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.primary,
    fontSize: Texts.title,
    fontWeight: "bold",

  },
  subtitle: {
    color: Colors.primary,
    fontSize: Texts.subtitle,
  },
  icon: {
    marginRight: 6,
  },
  itemList: {
    flex: 1,
    marginVertical: 8,
    borderRadius: 25,
    backgroundColor: "white",
  },
});
