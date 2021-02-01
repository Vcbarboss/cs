import React, { useState, useRef } from "react";
import { Modal, StatusBar, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Text } from "react-native";
import { Colors } from "../../helpers/Colors";
import Toast from "../../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../../helpers/Texts";
import moment from "moment";
import { Avatar } from "react-native-paper";
import { StudentProfileComponent } from "../../components/StudentProfileComponent";
import Badge from "react-native-paper/src/components/Badge";
import Loading from "../../components/Loading";

const screenHeight = Math.round(Dimensions.get("window").height);

export function StudentScreen({ route, navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const refNotification = useRef();
  const props = route.params;
  const [isVisible, setIsVisible] = useState(false)


  useFocusEffect(
    React.useCallback(() => {
    }, []),
  );

  return (
    <>
      {loading ? (
          <>
            <Toast ref={refNotification} />
            <Loading />
          </>
        )
        :
        (
    <View style={styles.container}>
      <Toast ref={refNotification} />
      <StatusBar
        backgroundColor={Colors.theme}
        barStyle="light-content"
      />
      <View style={{ backgroundColor: Colors.opt1 }}>

      </View>
      <View style={{ flexDirection: "row", backgroundColor: Colors.theme, padding: 20 }}>
        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.pop()}>
          <AntIcon name={"arrowleft"} style={{}} size={25} color={"white"} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.name}>{props?.item.student.person.name}</Text>
          <Text style={styles.class}>{props?.item.class_room.description} </Text>
        </View>
        <View style={{
          alignItems: "center",
          borderWidth: 2,
          borderRadius: 55,
          borderColor: "white",
          backgroundColor: "white",
        }}>
          <Avatar.Image size={100} source={{ uri: props?.item.student.person.avatar }} />
        </View>
      </View>
      <ScrollView style={{  backgroundColor: "white", elevation: 5 }}>

        <View style={{display: "flex", padding: 5, flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.itemList} onPress={() => setIsVisible(true)}>
            <AntIcon name={'user'} size={30}/>
            <Text style={{textAlign: 'center'}}> Perfil </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemList} onPress={() => navigation.navigate('StudentNotificationList')}>
            <View>
              {props.item.push_notification_recipients_count > 0 &&
              <Badge size={20}  style={{ position: "absolute", top: -5, right: -10, zIndex: 10 }}>{props.item.push_notification_recipients_count}</Badge>}
              <AntIcon name={'inbox'} size={30}/>
            </View>
            <Text style={{textAlign: 'center'}}> Mensagens </Text>
          </TouchableOpacity>
          {/*<TouchableOpacity style={styles.itemList}>*/}
          {/*  <AntIcon name={'calendar'} size={30}/>*/}
          {/*  <Text style={{textAlign: 'center'}}> Frequência </Text>*/}
          {/*</TouchableOpacity>*/}
        </View>
        <View style={{display: "flex", padding: 5, flexDirection: "row", justifyContent: "space-between" }}>
          {/*<TouchableOpacity style={styles.itemList}>*/}
          {/*  <AntIcon name={'table'} size={30}/>*/}
          {/*  <Text style={{textAlign: 'center'}}> Horário </Text>*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity style={styles.itemList} onPress={() => navigation.navigate('FormListScreen',
            { item: props?.item },
            )}>
            <AntIcon name={'filetext1'} size={30}/>
            <Text style={{textAlign: 'center'}}> Formulários </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemList} onPress={() => navigation.navigate('AuthPersonListScreen',
            { item: props?.item },
            )}>
            <View>
              {props.item.student.student_auth_person_count > 0 &&
              <Badge size={20} style={{ position: "absolute", top: -5, right: -10, zIndex: 10, backgroundColor: 'blue' }}>{props.item.student.student_auth_person_count}</Badge>}

              <Icon name={'ios-people-outline'} size={30}/>
            </View>

            <Text style={{textAlign: 'center'}}> Resposáveis retirada </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(false)
        }}
      >
      <StudentProfileComponent data={props.item} close={(e) => setIsVisible(e)}/>
      </Modal>
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
    margin: 5,
    borderRadius: 15,
    height: 120,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: Colors.opt1,
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
    textAlign: 'center'
  },
  class: {
    fontSize: 20,
    color: "white",
  },
});
