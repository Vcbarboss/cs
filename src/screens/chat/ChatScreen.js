import React, { useState, useCallback, useEffect, useRef } from "react";
import { Bubble, GiftedChat, Message, Send} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import { StyleSheet, Text, TouchableOpacity, View, Image  } from "react-native";
import { Colors } from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Texts } from "../../helpers/Texts";
import useApi from "../../hooks/Api";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "../../components/Toast";
import logo from "../../assets/imgs/construindo-o-saber.fw.png";
import moment from "moment";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import { useSelector } from "react-redux";
import Conecting from "../../components/Conecting";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

export function ChatScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const props = route.params;
  const api = useApi();
  const user = useRef();
  const tst = useRef([]);
  const refNotification = useRef();
  const chat = useSelector((state) => state).chatReducer;
  const msg_id = useRef();
  const [response, setResponse] = React.useState(null);

  const get = async (msg) => {
    if (msg) {
      setLoading(true);
    } else {

    }
    console.log(props);
    try {

      let res;
      if (msg_id.current) {
        console.log(`app/chat/sector/${props.item.chat_sector_id}/list${msg_id.current ? "?last_id=" + msg_id.current : ""}`);
        res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list${msg_id.current ? "?last_id=" + msg_id.current : ""}`);
      } else {
        setMessages([]);
        console.log(`app/chat/sector/${props.item.chat_sector_id}/list`);
        res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list`);

      }
      console.log(res);

      const items = res?.object?.list;
      items?.reverse();
      for (let i = 0; i < items?.length; i++) {

        const short = items[i];
        const aux = res.object.list?.length - i;
        if (short.send_by === "APP") {
          user.current = {
            _id: 1,
            name: short.app_name,
            avatar: short.app_avatar,
          };
          setMessages(previousMessages => GiftedChat.append(previousMessages,
            {
              _id: short.chat_message_id,
              text: short.message,
              createdAt: moment(short.created_at),
              user: {
                _id: 1,
                name: short.app_name.split(" ")[0],
                avatar: short.app_avatar,
              },
            },
          ));
        } else {
          setMessages(previousMessages => GiftedChat.append(previousMessages,
            {
              _id: short.chat_message_id,
              text: short.message,
              createdAt: moment(short.created_at),
              user: {
                _id: 2,
                name: short.usr_name.split(" ")[0],
                avatar: short.usr_avatar,
              },
            },
          ));

        }
        msg_id.current = short.chat_message_id;
      }
      setLoading(false);
      console.log(tst.current);
    } catch (e) {
      console.log(e);
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      console.log(refNotification);
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
      setLoading(false);
    }
  };

  const send = async (msg) => {
    const objToSend = {
      message: msg,
    };
    try {
      const res = await api.post(`app/chat/sector/${props.item.chat_sector_id}/send`, objToSend);
      console.log(res);
    } catch (e) {
      console.log(e);
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      console.log(refNotification);
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

    }
  };

  // useEffect(() => {
  //     get(true)
  // }, [chat])

  const onSend = useCallback((msg = []) => {
    console.log(msg[0].text);
    setMessages(previousMessages => GiftedChat.append(previousMessages, msg));
    setTimeout(() => {
      console.log(messages);
    }, 1500);

    send(msg[0].text);
  }, []);

  const library = () => {
     launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        setResponse(response);
      },
    )

  }
  const getDoc = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  const renderSend = (props) => {
    return (
      <>
        <TouchableOpacity style={{ marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center" }}
                          onPress={() => getDoc()}>
          <IonIcon name={"camera-outline"} style={{ marginTop: 10 }} size={27} color={Colors.primary} />
        </TouchableOpacity>
        <Send
          {...props}
        >
          <View style={{ marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", fontSize: 20, color: Colors.primary }}>
              Enviar
            </Text>
          </View>
        </Send>
      </>
    );
  };

  const renderMessage = (props) => {
    // console.log(props)
    let sameUserInPrevMessage = false;
    if (props.previousMessage.user !== undefined && props.previousMessage.user) {
      props.previousMessage.user._id === props.currentMessage.user._id ? sameUserInPrevMessage = true : sameUserInPrevMessage = false;
    }

    let messageBelongsToCurrentUser = user?.current?._id == props.currentMessage.user._id;
    return (
      <View>
        {!sameUserInPrevMessage &&
        <>
          {props.currentMessage.user._id !== 1 &&
          <Text>{props.currentMessage.user.name}</Text>
          }

        </>}
        <Bubble
          {...props}
        />
      </View>
    );

  };

  useFocusEffect(
    React.useCallback(() => {
      Colors.theme = Colors.primary;
      get();
    }, [chat]),
  );

  return (
    <>
      {loading ? (
          <Conecting />

        )
        :
        (
          <>
            <Toast ref={refNotification} />
            <GeneralStatusBarColor backgroundColor={Colors.primary}
                                   barStyle="light-content" />
            <View style={{ flexDirection: "row", backgroundColor: Colors.primary, padding: 20 }}>

              <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                <AntIcon name={"arrowleft"} style={{ marginTop: 10 }} size={25} color={"white"} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>

                <Text style={{ color: "white", fontSize: 23 }}>Construindo o Saber</Text>
                <Text style={{ color: "white", fontSize: Texts.subtitle }}>Chat </Text>
              </View>
              <TouchableOpacity style={{ marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center" }}
                                onPress={() => launchImageLibrary(
                                  {
                                    mediaType: 'photo',
                                    includeBase64: false,
                                    maxHeight: 200,
                                    maxWidth: 200,
                                  },
                                  (response) => {
                                    setResponse(response);
                                  },
                                )}>
                <IonIcon name={"camera-outline"} style={{ marginTop: 10 }} size={27} color={'white'} />
              </TouchableOpacity>

            </View>
            <View style={styles.response}>
              <Text>Res: {JSON.stringify(response)}</Text>
            </View>
            {response && (
              <View style={styles.image}>
                <Image
                  style={{width: 200, height: 200}}
                  source={{uri: response.uri}}
                />
              </View>
            )}
            <GiftedChat
              locale={"pt-br"}
              placeholder={"Digite sua menssagem..."}
              messages={messages}
              alwaysShowSend={true}
              onSend={messages => onSend(messages)}
              renderSend={renderSend}
              renderBubble={renderMessage}
              user={user.current}
            />
          </>
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  item: {},
});
