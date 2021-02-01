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
  TouchableOpacity,
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

const screenHeight = Math.round(Dimensions.get("window").height);

export function StudentProfileComponent(props, { navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const [data, setData] = useState(props.data);

  useFocusEffect(
    React.useCallback(() => {
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{}}>
        <TouchableOpacity style={{ backgroundColor: Colors.theme }} onPress={() => props.close(false)}>
          <AntIcon name={"arrowleft"} style={{ margin: 10 }} size={25} color={"white"} />
        </TouchableOpacity>
        <View style={{
          backgroundColor: Colors.theme,
          alignItems: "center",
        }}>
          <Avatar.Image size={150} source={{ uri: data.student.person.avatar }} />
          <Text
            style={{
              fontSize: 25,
              marginVertical: 20,
              fontWeight: "bold",
              color: "white",
            }}>{data?.student.person.name}</Text>
        </View>
        <View>
          {data.student.mother_person.name ?
            <View style={styles.item}>
              <Text style={styles.title}>Mãe: </Text>
              <Text style={styles.subtitle}>{data?.student.mother_person.name} </Text>
            </View>
            : <>
            </>}
          {data.student.father_person.name ?
            <View style={styles.item}>
              <Text style={styles.title}>Pai: </Text>
              <Text style={styles.subtitle}>{data?.student.father_person.name} </Text>
            </View>
            : <>
            </>}
          {data.student.guardian_person ?
            <View style={styles.item}>
              <Text style={styles.title}>Responsável legal: </Text>
              <Text style={styles.subtitle}>{data?.student.guardian_person.name} </Text>
            </View>
            : <>
            </>}
          <View style={styles.item}>
            <Text style={styles.title}>Idade: </Text>
            <Text
              style={styles.subtitle}>{data?.student.person.natural_birthday ? moment().diff(data.student.person.natural_birthday, "years") + " anos" : "Não cadastrada"} </Text>
          </View>
          <View style={{flexDirection: 'row', }}>
            <View style={[styles.item, {flex: 1}]}>
              <Text style={styles.title}>Série: </Text>
              <Text
                style={styles.subtitle}>{data?.class_room.school_grade.description}</Text>
            </View>
            <View style={[styles.item, {flex: 1}]}>
              <Text style={styles.title}>Turma: </Text>
              <Text style={styles.subtitle}>{data?.class_room.team} </Text>
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.title}>Período: </Text>
            <Text style={styles.subtitle}>{data?.class_room.period} </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#d9dade",
    backgroundColor: "#fcfcfc",
  },
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "transparent",
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
    fontSize: Texts.listTitle,
    fontWeight: "bold",
    marginVertical: 5,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Texts.listDescription,
    color: Colors.primary,
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
});
