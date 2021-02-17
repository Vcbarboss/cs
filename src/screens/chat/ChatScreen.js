import React, {useState, useCallback, useEffect, useRef} from "react";
import {Bubble, GiftedChat, InputToolbar, Message, Send} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import {StyleSheet, Linking, Text, TouchableOpacity, View, Image, Modal, Dimensions} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import {Texts} from "../../helpers/Texts";
import useApi from "../../hooks/Api";
import {useFocusEffect} from "@react-navigation/native";
import Toast from "../../components/Toast";
import logo from "../../assets/imgs/construindo-o-saber.fw.png";
import moment from "moment";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {useSelector} from "react-redux";
import Conecting from "../../components/Conecting";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {NotificationComponent} from "../../components/NotificationComponent";
import {TextInput} from "react-native-paper";
import ImgToBase64 from "react-native-image-base64";
import CustomView from "./CustomView";

const image = ['png', 'jpg', 'jpeg']

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function ChatScreen({route, navigation}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState()
    let props = route.params;
    const api = useApi();
    const user = useRef();
    const lastUrl = useRef();
    const refNotification = useRef();
    const sector_id = useRef()
    const chat = useSelector((state) => state).chatReducer;
    const sector = useSelector((state) => state).sectorReducer;
    const msg_id = useRef();
    const img = useRef()
    const [response, setResponse] = React.useState(null);

    const get = async (e) => {
        if (e) {
            setLoading(true);
        } else {

        }
        if (msg_id.current === '' || lastUrl.current !== `app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`) {
            try {
                let res;
                if (msg_id.current) {
                    lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`;
                    console.log(lastUrl);
                    res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`);
                } else {
                    setMessages([]);
                    lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/list`
                    console.log(lastUrl);
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
                                image: short.attachment_extension === 'png' || 'jpg' && short.attachment_url,
                                doc: short.attachment_extension === 'pdf' && short.attachment_url
                            },
                        ));
                    } else {
                        setMessages(previousMessages => GiftedChat.append(previousMessages,
                            {
                                _id: short.chat_message_id,
                                text: short.attachment_extension === 'pdf' ? short.attachment_name : short.message,
                                createdAt: moment(short.created_at),
                                user: {
                                    _id: 2,
                                    name: short.usr_name.split(" ")[0],
                                    avatar: short.usr_avatar,
                                },
                                image: image.includes(short.attachment_extension) && short.attachment_url,
                                doc: short.attachment_extension === 'pdf' && short.attachment_url
                            },
                        ));
                    }
                    msg_id.current = short.chat_message_id;
                }
                //setLoading(false);
            } catch (e) {
                console.log(e);
                let aux;
                for (let i = 0; i < Object.keys(e.validator).length; i++) {
                    aux = e.validator[Object.keys(e.validator)[i]][0];
                    break;
                }
                refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
                setLoading(false);
            }
        }
    };

    const send = async (msg) => {

        const objToSend = {
            message: msg,
            attach_name: img.current?.name ? img.current?.name : '',
            attach_base64: img.current?.base64 ? img.current?.base64 : ''
        };
        if (props.item.chat_sector_id !== sector && sector !== -1) {
            props = {
                item: {
                    chat_sector_id: sector
                }
            }
        }
        console.log(response)
        console.log(objToSend)
        try {
            lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/send`;
            console.log(lastUrl);
            const res = await api.post(`app/chat/sector/${props.item.chat_sector_id}/send`, objToSend);
            get()
            console.log(res);
            setResponse()
        } catch (e) {
            console.log(e);
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

        }
    };


    const onSend = useCallback((msg = []) => {

        const obj = {
            ...msg[0],
            image: img.current?.uri
        }
        console.log(obj)
        //setMessages(previousMessages => GiftedChat.append(previousMessages, obj));
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
            },
            (response) => {
                setResponse(response);
            },
        )

    }
    const getDoc = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.docx, DocumentPicker.types.xls, DocumentPicker.types.pdf],
            });
            console.log(
                res.uri,
                res.type,
                res.name,
                res.size
            );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }

    const renderSend = (props) => {
        return (
            <>
                {/*<TouchableOpacity style={{ marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center" }}*/}
                {/*                  onPress={() => getDoc()}>*/}
                {/*  <IonIcon name={"attach"} style={{ marginTop: 10 }} size={27} color={Colors.primary} />*/}
                {/*</TouchableOpacity>*/}
                <Send
                    {...props}
                >
                    <View style={{marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{textAlign: "center", fontSize: 20, color: Colors.primary}}>
                            Enviar
                        </Text>
                    </View>
                </Send>
            </>
        );
    };

    const renderMessage = (props) => {
        //console.log(props)
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
                {props.currentMessage.pdf ?
                    <>
                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderColor: '#f66',
                            borderRadius: 5,
                            padding: 5,
                            maxWidth: screenWidth * 0.8,
                            flexDirection: 'row'
                        }} onPress={() => Linking.openURL(props.currentMessage.pdf)}>

                            <View style={{justifyContent: 'center'}}>
                                <AntIcon name={"pdffile1"} style={{}} size={25} color={"#f66"}/>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{color: 'black'}}>
                                    {props.currentMessage.text}
                                </Text>
                            </View>

                        </TouchableOpacity>

                    </>
                    :
                    <>
                        <Bubble
                            {...props}
                        />
                    </>
                }
            </View>
        );
    };

    const renderChatFooter = (props) => {
        return (
            <>
                {!response?.didCancel &&
                <>
                    {response && (
                        <View style={styles.image}>
                            <TouchableOpacity style={{position: 'absolute', right: 5, top: 2}}
                                              onPress={() => setResponse()}>
                                <AntIcon name={"close"} style={{marginTop: 10}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <Image
                                style={{width: 200, height: 200}}
                                source={{uri: response.uri}}
                            />
                        </View>
                    )}
                </>
                }
            </>
        );
    }

    // const renderCustomView = (props) => {
    //     console.log(props)
    //     return (
    //         <CustomView
    //             {...props}
    //         />
    //     );
    // };

    useFocusEffect(
        React.useCallback(() => {
            Colors.theme = Colors.primary;
            console.log(sector)
            if (props.item.chat_sector_id !== sector && sector !== -1) {
                props = {
                    item: {
                        chat_sector_id: sector
                    }
                }
            }
            get();
        }, [chat]),
    );

    return (
        <>
            {loading ? (
                    <Conecting/>

                )
                :
                (
                    <View style={{flex: 1}}>
                        <Toast ref={refNotification}/>
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>

                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: 23}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>Chat </Text>
                            </View>
                            <TouchableOpacity style={{
                                marginRight: 10,
                                marginBottom: 10,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                                              onPress={() => launchImageLibrary(
                                                  {
                                                      mediaType: 'photo',
                                                      includeBase64: false,
                                                  },
                                                  (response) => {
                                                      setResponse(response);
                                                      ImgToBase64.getBase64String(response?.uri)
                                                          .then(base64String => {
                                                              img.current = {
                                                                  name: response.fileName,
                                                                  uri: response.uri,
                                                                  base64: base64String
                                                              }
                                                              setResponse({
                                                                  ...response,
                                                                  [`base64`]: base64String
                                                              })
                                                          })
                                                          .catch(err => console.log(err));
                                                  },
                                              )}>
                                <IonIcon name={"camera-outline"} style={{marginTop: 10}} size={27} color={'white'}/>
                            </TouchableOpacity>

                        </View>
                        {/*<View style={styles.response}>*/}
                        {/*    <Text>Res: {JSON.stringify(response?.uri)}</Text>*/}
                        {/*</View>*/}
                        <GiftedChat
                            locale={"pt-br"}
                            placeholder={"Digite sua menssagem..."}
                            messages={messages}
                            alwaysShowSend={true}
                            onSend={messages => {
                                console.log(messages)
                                if(messages.text === ""){
                                    messages.text = " "
                                }
                                onSend(messages)
                            }}
                            renderSend={renderSend}
                            renderChatFooter={renderChatFooter}
                            renderBubble={renderMessage}
                            // renderCustomView={renderCustomView}
                            user={user.current}
                        />
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isVisible}
                            onRequestClose={() => {
                                setIsVisible(false);
                            }}
                        >
                            <View style={[styles.modal,]}>
                                <View style={styles.card}>
                                    <View style={styles.opt}>
                                        <AntIcon name={"pdffile1"} style={{}} size={55} color={"#f66"}/>
                                        <Text>
                                            Camera
                                        </Text>
                                    </View>
                                    <View style={styles.opt}>
                                        <Text>
                                            Foto
                                        </Text>
                                    </View>
                                    <View style={styles.opt}>
                                        <AntIcon name={"pdffile1"} style={{}} size={55} color={"#f66"}/>
                                        <Text>
                                            Documento
                                        </Text>
                                    </View>

                                </View>

                            </View>

                        </Modal>
                    </View>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    item: {},
    image: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7c7c7c'
    },
    opt: {
        borderWidth: 3,
        borderColor: Colors.lightgray,
        borderRadius: 10,
        width: 100,
        height: 100,
        justifyContent:'center',
        alignItems: 'center'
    },
    modal: {
        flex: 1,
        backgroundColor: "rgba(60, 60, 60, 0.5)",
        justifyContent: "flex-end",
        alignItems: "center",

    },
    card: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 50
    }

});
