import React, { useState, useRef } from "react";
import { Platform, StatusBar, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Text, RefreshControl } from "react-native";
import { Colors } from "../helpers/Colors";
import Toast from "../components/Toast";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import { Texts } from "../helpers/Texts";
import useAuth from "../hooks/Auth";
import { useDispatch, useSelector } from "react-redux";
import StudentList from "../components/StudentList";
import Loading from "../components/Loading";
import GeneralStatusBarColor from "../components/StatusBarColor";
import * as Sentry from "@sentry/react-native";
import Field from "../components/Field";
import {Badge} from "react-native-paper";

const screenHeight = Math.round(Dimensions.get("window").height);

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export function HomeScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const api = useApi({ navigation });
  const dispatch = useDispatch();
  const refNotification = useRef();
  const { getFcmToken } = useAuth();
  const notifications = useSelector((state) => state).notificationReducer;
  const chatBadge = useSelector((state) => state).chatBadgeReducer;
  const user = useSelector((state) => state).userReducer;
  const [refreshing, setRefreshing] = React.useState(false);
  const [fcm, setFcm] = useState()
  const chat = useRef(0)

  const onRefresh  =  React.useCallback(async() => {
    setRefreshing(true);
    const res = await api.get('app/notification/count');
    dispatch({type: 'init_notifications', data: res.object.total_unread})

    wait(500).then(() => setRefreshing(false));
  }, []);

  const get = async () =>{
    const res = await api.get("app/me");
    const aux =  await getFcmToken()
    setFcm( aux)

  }

  const badgeChat = async () => {
    setLoading(true)
    try {
      const res = await api.get("app/chat/sector/list")
      chat.current = 0;

      for (let i = 0; i < res.object.length; i++) {

        if(res.object[i]?.chats[0]?.unread_messages){

          chat.current = chat.current + res.object[i]?.chats[0]?.unread_messages;
          console.log(res.object[i]?.chats[0]?.unread_messages)
          console.log(chat.current)
        }

      }
      console.log(chat)
      dispatch({ type: "init_badgeChat", data: chat.current });
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      Colors.theme = Colors.primary
      get()
      badgeChat()
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
            <View style={{ backgroundColor: "#fafafa",
              borderBottomWidth: 1, borderColor: '#e0dede'}}>
              <View style={{ flexDirection: "row", padding: 20, backgroundColor: Colors.primary }}>
                <TouchableOpacity style={{justifyContent: "center",  }}
                                  onPress={() => navigation.openDrawer()}>
                  {notifications > 0 || chatBadge > 0 &&
                  <Badge style={{
                    position: "absolute",
                    top: "25%",
                    right: "10%",
                    backgroundColor: "#ff190c",
                    fontWeight: "bold",
                    fontSize: 14,
                    elevation: 1
                  }}
                         size={10}> </Badge>}
                    <Icon name={"menu-outline"} style={{ }} size={35} color={'white'} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 5, justifyContent: "flex-start", paddingVertical: 5, }}>
                  {/*<Image source={logo} style={styles.logo} />*/}
                  <Text style={{ color: "white", fontSize: 23, }}>Construindo o Saber</Text>
                  <Text style={{ color: "white", fontSize: Texts.subtitle, }}>Alunos </Text>
                </View>


              </View>
            </View>
            <ScrollView style={{ paddingHorizontal: 3 }} refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>

              <StudentList style={{ margin: 3, elevation: 3 }} refresh={refreshing} navigation={navigation} />

                {/*<Field*/}
                {/*    multiline={5}*/}
                {/*    value={fcm}*/}
                {/*/>*/}


              {/*<TouchableOpacity style={styles.itemList}>*/}
              {/*  <MenuCard icon={'calendar'} title={'Calendário'} iconColor={'white'} bg={Colors.opt2} rightIconColor={Colors.primary}/>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity style={[styles.itemList,{backgroundColor: Colors.opt4}]} onPress={() => navigation.navigate("ProfileScreen")}>*/}
              {/*  <MenuCard icon={"user"} title={"Perfil"} iconColor={"white"} bg={Colors.opt5}*/}
              {/*            rightIconColor={Colors.primary} img={profile}/>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity style={styles.itemList}>*/}
              {/*  <MenuCard icon={'solution1'} title={'Boletim'} iconColor={'white'} bg={Colors.opt4} rightIconColor={Colors.primary}/>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity style={styles.itemList}>*/}
              {/*  <MenuCard icon={'message1'} title={'Informativo'} iconColor={'white'} bg={Colors.opt5} rightIconColor={Colors.primary}/>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity style={[styles.itemList,{backgroundColor: Colors.opt3}]}>*/}
              {/*  <MenuCard icon={'calendar'} title={'Presenças'} iconColor={'white'} bg={Colors.opt6} img={calendar} rightIconColor={Colors.primary}/>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity style={styles.itemList}>*/}
              {/*  <MenuCard icon={'calendar'} title={'Horários'} iconColor={'white'} bg={Colors.opt7} rightIconColor={Colors.primary}/>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity style={styles.itemList}>*/}
              {/*  <MenuCard icon={'calendar'} title={'Faturas'} iconColor={'white'} bg={Colors.opt8} rightIconColor={Colors.primary}/>*/}
              {/*</TouchableOpacity>*/}
            </ScrollView>
          </View>
        )}
    </>

  );
}

const styles = StyleSheet.create({
  itemList: {
    flex: 1,
    margin: 3,
    height: 150,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
  },

  subtitle: {
    color: Colors.secondary,
    fontSize: Texts.subtitle,

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
    resizeMode: "contain",
    flex: 1
  },
});
