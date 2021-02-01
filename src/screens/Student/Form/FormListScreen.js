import React, { useState, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView, Modal,
} from "react-native";
import { Colors } from "../../../helpers/Colors";
import Toast from "../../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../../components/Loading";
import { Texts } from "../../../helpers/Texts";
import Icon from "react-native-vector-icons/Ionicons";
import FilterNotification from "../../../components/FilterNotification";

const screenHeight = Math.round(Dimensions.get("window").height);

const list = [
  { label: "Preenchidos", value: "filled" },
  { label: "Não preenchidos", value: "blank" },
  { label: "Todos", value: "all" },
];

export function FormListScreen({ route, navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const props = route.params;
  const [filter, setFilter] = useState({ label: "Todos", value: "all" });
  const [filterModal, setFilterModal] = useState(false);
  const [data, setData] = useState();

  const getData = async () => {

    setLoading(true);
    try {
      const res = await api.get(`app/enrollment/${props.item.enrollment_id}/form/list/${filter.value}`);

      setData(res.object);
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
    }, [filter]),
  );

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
              backgroundColor={Colors.theme}
              barStyle="light-content"
            />
            <View style={{ backgroundColor: Colors.opt1 }}>

            </View>
            <View style={{ flexDirection: "row", backgroundColor: Colors.theme, padding: 20 }}>
              <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                <AntIcon name={"arrowleft"} style={{}} size={25} color={"white"} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>

                <Text style={{ color: "white", fontSize: 23, }}> Construindo o Saber</Text>
                <Text style={{ color: "white", fontSize: Texts.subtitle, }}> Formulários </Text>
              </View>
              <TouchableOpacity style={{ alignItems: "flex-end", justifyContent: "center", flexDirection: 'row' }}
                                onPress={() => setFilterModal(true)}>
                <Icon name={"filter-outline"} style={{ marginRight: 10 }} size={25} color={"white"} />
                <Text style={{color: 'white', fontWeight: 'bold'}}> {filter.label}</Text>
              </TouchableOpacity>
            </View>
            {data?.length > 0 ?
                <ScrollView style={{backgroundColor: "white", elevation: 5}}>
                  {data?.map((item, index) =>
                      <TouchableOpacity key={index} style={[styles.item, {
                        backgroundColor: item.filled ? Colors.selected : "white",
                        borderColor: item.filled ? Colors.selectedBorder : "gainsboro",
                      }]} onPress={() => navigation.navigate("FormScreen", {
                        item: item,
                        enrollment: props.item.enrollment_id,
                      })}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.description}</Text>
                      </TouchableOpacity>,
                  )}

                </ScrollView>
                :
                <View style={{flex:1, alignItems:'center', justifyContent: 'center', backgroundColor: 'white', padding: 10}}>
                  {/*<Image source={logo} style={styles.logo} />*/}
                  <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                    {props.item.student.person.name.split(" ")[0]} ainda não possui nenhum formulário
                  </Text>
                </View>
            }
            <Modal
              animationType="slide"
              transparent={true}
              visible={filterModal}
              onRequestClose={() => {
                setFilterModal(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>

                  <FilterNotification
                    title={"Filtre seus formulários"}
                    list={list}
                    selected={filter.label}
                    close={(e) => setFilterModal(e)}
                    select={(item) => {
                      setFilter(item);
                    }} />
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        )}
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    display: "flex",
    backgroundColor: Colors.opt1,
  },
  title: {
    fontSize: Texts.listTitle,
    fontWeight: "bold",
    marginVertical: 5,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Texts.listDescription,
    marginTop: 5,
    color: Colors.primary
  },
  item: {
    padding: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#d9dade",
    backgroundColor: "#fcfcfc",
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
