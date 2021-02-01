import React, { useState, useRef } from "react";
import {
  Modal,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import { Colors } from "../../helpers/Colors";
import Toast from "../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Avatar } from "react-native-paper";
import { StudentProfileComponent } from "../../components/StudentProfileComponent";
import { AuthPersonComponent } from "../../components/AuthPersonComponent";
import Loading from "../../components/Loading";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import { Texts } from "../../helpers/Texts";
import RoundButton from "../../components/Buttons/RoundButton";

const screenHeight = Math.round(Dimensions.get("window").height);

export function AuthPersonListScreen({ route, navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const props = route.params;
  const [data, setData] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [del, setDel] = useState(false);
  const [id, setId] = useState()

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`app/enrollment/${props.item.enrollment_id}/auth-person/list`);

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

  const handleDelete = async () => {
    try {
      const res = await api.del(`app/enrollment/${props.item.enrollment_id}/auth-person/${id}`);

      setDel(false)
      getData()
    } catch (e) {
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
      setDel(false)
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if(!isVisible){
        getData()
      }
    }, [isVisible]),
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
              <TouchableOpacity style={{   }} onPress={() => navigation.pop()}>
                <AntIcon name={"arrowleft"} style={{}} size={25} color={"white"} />
              </TouchableOpacity>
              <View style={{flex: 1, justifyContent: 'center',paddingLeft: 10}}>

                <Text style={{ color: "white", fontSize: 23, }}> Construindo o Saber</Text>
                <Text style={{ color: "white", fontSize: Texts.subtitle, }}> Responsáveis retirada </Text>

              </View>
              <TouchableOpacity style={{  marginTop: 10, alignItems: "flex-end" }}
                                onPress={() => setIsVisible(true)}>

              </TouchableOpacity>
            </View>
            {data?.length > 0 ?
                <ScrollView style={{backgroundColor: "white", elevation: 5}}>

                  {data?.map((item, index) =>
                      <TouchableOpacity key={index} style={styles.item}
                                        onPress={() => {
                                          setId(item.student_auth_person_id)
                                          setDel(true);
                                        }}>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{
                            height: 50,
                            borderRadius: 30,
                            width: 50,
                            backgroundColor: Colors.primary,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <AntIcon name={"user"} style={{}} size={30} color={"white"}/>
                          </View>
                          <View>
                            <View style={{flex: 1, marginLeft: 10}}>
                              <Text style={styles.title}>{item.person_name}</Text>
                            </View>
                            <View style={{flex: 1, marginLeft: 10}}>
                              <Text style={styles.subtitle}>{item.person_kinship_ptbr}</Text>
                            </View>
                          </View>

                        </View>


                      </TouchableOpacity>,
                  )}


                </ScrollView>
                :
                <View style={{flex:1, alignItems:'center', justifyContent: 'center', backgroundColor: 'white'}}>
                  {/*<Image source={logo} style={styles.logo} />*/}
                  <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                    {props.item.student.person.name.split(" ")[0]} ainda não possui nenhum responsável para retirada
                  </Text>
                </View>
            }
            <Modal
              animationType="slide"
              transparent={false}
              visible={isVisible}
              onRequestClose={() => {
                setIsVisible(false);
              }}
            >
              <AuthPersonComponent id={props.item.enrollment_id} close={(e) => setIsVisible(e)} />
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={del}
              onRequestClose={() => {
                setDel(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>

                  <Text style={{ fontSize: 17, textAlign: "center", marginBottom: 10 }}> Deseja remover o responsável? </Text>
                  <View style={{ flexDirection: "row" }}>

                    <ButtonStyle1
                      text={"Não"}
                      style={{ margin: 3, padding: 8 }}
                      loading={loading}
                      primaryColor={Colors.pendingBorder}
                      secondaryColor={Colors.pendingBorder}
                      color={Colors.white}
                      borderRadius={15}
                      onPress={() => {
                        setDel(false);
                      }}
                    />
                    <ButtonStyle1
                      text={"Sim"}
                      style={{ margin: 3, padding: 8 }}
                      loading={loading}
                      primaryColor={'#014763'}
                      secondaryColor={'#014763'}
                      color={Colors.white}
                      borderRadius={15}
                      onPress={() => {
                        handleDelete();
                      }}
                    />
                  </View>
                </View>
              </View>


            </Modal>
            <View style={{width: '100%', elevation: 6, padding: 10, flexDirection:'row-reverse', position: 'absolute', bottom: 0, justifyContent: 'space-between'}}>
              <RoundButton
                component={
                  <AntIcon
                    name={"plus"}
                    style={{}}
                    size={25}
                    color={"white"} />
                }
                loading={loading}
                primaryColor={Colors.green}
                secondaryColor={Colors.green}
                color={Colors.white}
                onPress={() => setIsVisible(true)}
              />
            </View>
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
    //margin: 5,
    borderBottomWidth: 1,
    borderColor: "#d9dade",
    backgroundColor: "#fcfcfc",
    // borderColor: '#22c58b',
    // backgroundColor: '#e9f9f4',
    //borderRadius: 5,
  },
});
