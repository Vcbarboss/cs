import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer, Badge, Divider } from "react-native-paper";
import IonIcon from "react-native-vector-icons/Ionicons";
import SIcon from "react-native-vector-icons/SimpleLineIcons";
import useAuth from "../hooks/Auth";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../hooks/Api";
import logo from "../assets/imgs/construindo-o-saber-full.fw.png";
import { Colors } from "../helpers/Colors";
import GeneralStatusBarColor from "./StatusBarColor";

export function DrawerComponent(props,) {
  const refNotification = useRef();
  const api = useApi({navigation: props.navigation} );
  const notifications = useSelector((state) => state).notificationReducer;
  const user = useSelector((state) => state).userReducer;
  const { logoutWithoutApi } = useAuth();

  const doLogout = async () => {
    try {
      const res = await api.get("app/logout");
    } catch (e) {
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
    }
    logoutWithoutApi();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen", params: { order: 0 } }],
    });
  };

  return (

    <>
      <GeneralStatusBarColor backgroundColor={'white'}
                             barStyle="light-content"/>
      <DrawerContentScrollView {...props}>
          <View style={{ flex: 1, justifyContent: "flex-start", height: 100, padding: 10 }}>
            <Image source={logo} style={styles.logo} />
          </View>
        <Divider />
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <SIcon
                name="graduation"
                color={Colors.primary}
                size={size}
              />
            )}
            label="Alunos"
            onPress={() => {
              props.navigation.navigate("HomeScreen");
            }}
            labelStyle={{ color: Colors.primary }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <IonIcon
                name="ios-person-outline"
                color={Colors.primary}
                size={size}
              />
            )}
            label="Perfil"
            onPress={() => {
              props.navigation.navigate("ProfileScreen");
            }}
            labelStyle={{ color: Colors.primary }}
          />
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <>
                <IonIcon
                  name="notifications-outline"
                  color={Colors.primary}
                  size={size}
                />
              </>
            )}
            label={"Notificações"}
            onPress={() => {
              props.navigation.navigate("NotificationList");
            }}
            labelStyle={{ color: Colors.primary }}
          />
          {notifications > 0 &&
          <Badge style={{
            position: "absolute",
            top: "27%",
            right: "10%",
            backgroundColor: "#ff190c",
            fontWeight: "bold",
            fontSize: 14,
          }}
                 size={25}>{notifications}</Badge>}


        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <IonIcon
                name="key-outline"
                color={Colors.primary}
                size={size}
              />
            )}
            label="Trocar Senha"
            onPress={() => {
              props.navigation.navigate("ChangePasswordScreen");
            }}
            labelStyle={{ color: Colors.primary }}
          />
          <DrawerItem icon={({ color, size }) => (
            <IonIcon
              name={"ios-exit-outline"}
              color={ Colors.primary}
              size={size} />
          )}
                      label={"Sair"}
                      onPress={() => {
                        doLogout();
                      }}
                      labelStyle={{ color: Colors.primary }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,

  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
    color: "#002d3a",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: "#326e80",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logo: {
    width: "100%",
    resizeMode: "contain",
    flex: 1,
  },
});
