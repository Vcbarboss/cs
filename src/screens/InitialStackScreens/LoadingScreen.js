import React, { useEffect, useRef } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../helpers/Colors";
import useAuth from "../../hooks/Auth";
import { useDispatch } from "react-redux";
import { Env } from "../../Env";
import useApi from "../../hooks/Api";
import logo from "../../assets/imgs/construindo-o-saber.fw.png";
import messaging, { firebase } from "@react-native-firebase/messaging";

export function LoadingScreen({ navigation }) {
  const { getUser, getFcmToken, setFcmToken } = useAuth();
  const dispatch = useDispatch();
  const isLogged = useRef(false);
  const api = useApi();
  const refNotification = useRef();

  const getNotifications = async () => {
    try {
      const res = await api.get('app/notification/count');

      dispatch({type: 'init_notifications', data: res.object.total_unread})
    } catch (e) {
    }

  };

  const configFirebase = async (refreshToken) => {

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage !== null) {
          navigation.navigate("NotificationList");

        }
      });

    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      if (refreshToken) {

        try {
          const res = await api.put("app/set-firebase-token", { firebase_token: refreshToken });

          await setFcmToken(refreshToken);
        } catch (e) {
          let aux;
          for (let i = 0; i < Object.keys(e.validator).length; i++) {
            aux = e.validator[Object.keys(e.validator)[i]][0];
            break;
          }
          refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

        }
      } else {
        let fcm = await getFcmToken();
        messaging()
          .getToken()
          .then(async token => {
            if (fcm !== token) {
              try {
                const res = await api.put("app/set-firebase-token", { firebase_token: token });

                await setFcmToken(token);
              } catch (e) {
                let aux;
                for (let i = 0; i < Object.keys(e.validator).length; i++) {
                  aux = e.validator[Object.keys(e.validator)[i]][0];
                  break;
                }
                refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

              }
            }
          });
      }
    }

  };

  const initConfig = async () => {
    let user = await getUser();
    try {
      if (user) {
        Env.header[`userToken`] = user.userToken;

        dispatch({ type: "rebase_user", data: user });
        isLogged.current = true;
        configFirebase();
        getNotifications();
        if (user.object.person.contact_mobile_phone === null) {
          setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: "FirstLoginScreen" }] });
          }, 1500);
        } else {
          setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: "HomeStack" }] });
          }, 1500);
        }

      } else {
        navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
      }
    } catch (e) {
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

    }

  };

  const config = async () => {
    const authorizationStatus = await messaging().requestPermission();
    (isLogged.current && authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) && messaging()?.onTokenRefresh(token => {
      configFirebase(token);
    });
  };

  useEffect(() => {
    initConfig();

    return () => {
      config();
    };
  }, []);

  return (
    <View style={styles.content}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

  },
  card: {
    backgroundColor: "white",
    borderColor: "black",
    margin: 10,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  logo: {
    width: "100%",
    resizeMode: "contain",
  },
  box: {
    flex: 1,
    borderLeftWidth: 5,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    backgroundColor: "white",
    borderLeftColor: Colors.green,
    width: "90%",
    height: 100,
  },
});
