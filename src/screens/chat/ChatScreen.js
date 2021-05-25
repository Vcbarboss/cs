import React, {useState, useCallback, useEffect, useRef} from "react";
import {Bubble, GiftedChat, InputToolbar, Message, Send} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import {
    StyleSheet,
    Linking,
    Text,
    TouchableOpacity,
    View,
    Image,
    Modal,
    Dimensions,
    ActivityIndicator,
    PermissionsAndroid,
    KeyboardAvoidingView
} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import MAIcon from "react-native-vector-icons/MaterialIcons";
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
import {RNCamera, FaceDetector} from 'react-native-camera';
import ImgToBase64 from "react-native-image-base64";
import CustomView from "./CustomView";
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from "react-native-image-crop-picker";
import {openSettings, check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const image = ['png', 'jpg', 'jpeg']
const docs = ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx']

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function ChatScreen({route, navigation}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [isCam, setIsCam] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const first = useRef(true)
    const title = useRef()
    let props = route.params;
    const api = useApi();
    const user = useRef();
    const lastUrl = useRef();
    const refNotification = useRef();
    const chat = useSelector((state) => state).chatReducer;
    const sector = useSelector((state) => state).sectorReducer;
    const msg_id = useRef();
    const img = useRef()
    const cameraRef = useRef();
    const [response, setResponse] = React.useState(null);
    const imagePath = useRef(undefined);
    const [isDenied, setIsDenied] = useState(false)

    const get = async (e) => {
        if (first.current) {
            setLoading(true);
            first.current = false
        }
        if (msg_id.current === '' || lastUrl.current !== `app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`) {
            try {
                let res;
                if (msg_id.current) {
                    lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`;
                    res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`);
                } else {
                    setMessages([]);
                    lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/list`
                    res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list`);

                }
                title.current = res.object?.chat?.description
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
                                text: docs.includes(short.attachment_extension) ? short.attachment_name : short.message,
                                createdAt: moment(short.created_at),
                                user: {
                                    _id: 1,
                                    name: short.app_name.split(" ")[0],
                                    avatar: short.app_avatar,
                                },
                                image: image.includes(short.attachment_extension) && short.attachment_url,
                                doc: docs.includes(short.attachment_extension) && short.attachment_url,
                                ext: short?.attachment_extension
                            },
                        ));
                    } else {
                        setMessages(previousMessages => GiftedChat.append(previousMessages,
                            {
                                _id: short.chat_message_id,
                                text: docs.includes(short.attachment_extension) ? short.attachment_name : short.message,
                                createdAt: moment(short.created_at),
                                user: {
                                    _id: 2,
                                    name: short.usr_name.split(" ")[0],
                                    avatar: short.usr_avatar,
                                },
                                image: image.includes(short.attachment_extension) && short.attachment_url,
                                doc: docs.includes(short.attachment_extension) && short.attachment_url,
                                ext: short?.attachment_extension
                            },
                        ));
                    }
                    msg_id.current = short.chat_message_id;
                }
                setLoading(false);
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

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = {quality: 0.5, base64: true};
            const data = await cameraRef.current.takePictureAsync(options);
            ImagePicker.openCropper({
                path: data.uri,
                width: 300,
                height: 400,
                cropping: true,
                cropperCircleOverlay: true,
                cropperToolbarTitle: 'Recortar Imagem',
                cropperStatusBarColor: Colors.primary
            }).then(image => {
                imagePath.current = image.path;
            });
        }
    };

    const send = async (msg) => {
        setSendLoading(true)
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
        try {
            lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/send`;
            const res = await api.post(`app/chat/sector/${props.item.chat_sector_id}/send`, objToSend);
            get()
            setResponse()

            img.current = {}
            setSendLoading(false)
        } catch (e) {
            console.log(e);
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setSendLoading(false)
        }
    };

    const onSend = useCallback((msg = []) => {

        const obj = {
            ...msg[0],
            image: img.current?.uri
        }
        //setMessages(previousMessages => GiftedChat.append(previousMessages, obj));
        setTimeout(() => {
        }, 1500);

        send(msg[0].text);
    }, []);

    const getDoc = async (mode) => {
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.docx,
                    DocumentPicker.types.xls,
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.doc,
                    DocumentPicker.types.csv,
                ],
            });


            const fs = RNFetchBlob.fs;
            fs.readFile(res.uri, 'base64')
                .then(data => {
                    img.current = {
                        name: res.name,
                        uri: res.uri,
                        base64: data,
                        type: res.type
                    }
                    setResponse({
                        name: res.name,
                        uri: res.uri,
                        base64: data,
                        doc: true,
                        type: res.type
                    })
                })


                .catch(err => console.log(err));

            setIsVisible(false)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(err)
            } else {
                throw err;
                console.log(err)
            }
            setIsVisible(false)
        }
    }

    const requestCameraPermission = async (mode) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getImage(mode)
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const checkPermission = (mode) => {
        {

            mode === 'cam' &&

            check(PERMISSIONS.IOS.CAMERA)
                .then((result) => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            console.log('This feature is not available (on this device / in this context)');
                            setIsDenied(true)
                            getImage(mode)
                            break;
                        case RESULTS.DENIED:
                            console.log('The permission has not been requested / is denied but requestable');

                            getImage(mode)
                            break;
                        case RESULTS.LIMITED:
                            console.log('The permission is limited: some actions are possible');
                            break;
                        case RESULTS.GRANTED:
                            console.log('The permission is granted');
                            getImage(mode)
                            break;
                        case RESULTS.BLOCKED:
                            console.log('The permission is denied and not requestable anymore');
                            setIsDenied(true)
                            getImage(mode)
                            break;
                    }
                })
                .catch((error) => {
                    // …
                });
        }

    }


    const getImage = (mode) => {

        {
            mode === 'cam' &&
            launchCamera(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                },
                (response) => {

                    if (response.uri) {
                        ImgToBase64.getBase64String(response?.uri)
                            .then(base64String => {
                                img.current = {
                                    name: response.fileName,
                                    uri: response.uri,
                                    base64: base64String
                                }
                                setResponse({
                                    ...response,
                                    photo: true
                                })
                            })
                            .catch(err => console.log(err));
                    }
                },
            )
        }
        {
            mode === 'image' &&
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                },
                (response) => {
                    if (response.uri) {
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
                                    [`base64`]: base64String,
                                    photo: true
                                })
                            })
                            .catch(err => console.log(err));
                    }
                },
            )
        }
    }

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
                {props.currentMessage.doc ?
                    <>
                        <TouchableOpacity style={{
                            padding: 5,
                            maxWidth: screenWidth * 0.9,
                            flexDirection: 'row',
                        }} onPress={() => Linking.openURL(props.currentMessage.doc)}>
                            <View style={{
                                flexDirection: 'row',
                                borderWidth: 1,
                                borderColor: '#7c7c7c',
                                borderRadius: 10,
                                padding: 20,
                                maxWidth: screenWidth * 0.8,
                                backgroundColor: 'white',
                                justifyContent: 'center'
                            }}>
                                <>
                                    {props.currentMessage.ext === 'pdf' ?
                                        <>
                                            <AntIcon name={"pdffile1"} style={{}} size={20} color={"#f66"}/>
                                            <Text style={{color: 'black', marginLeft: 10}}>
                                                {props.currentMessage.text}
                                            </Text>
                                        </>
                                        :
                                        <>
                                            <IonIcon name={"document-outline"} style={{}} size={20} color={"black"}/>
                                            <Text style={{color: 'black', marginLeft: 10}}>
                                                {props.currentMessage.text}
                                            </Text>
                                        </>
                                    }
                                </>
                            </View>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: 'white',
                                },
                                right: {
                                    backgroundColor: Colors.primary
                                }
                            }}
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
                    {response &&
                    <>
                        {response.photo &&
                        <View style={styles.image}>

                            <Image
                                style={{width: "100%", resizeMode: "contain", flex: 1,}}
                                source={{uri: response.uri}}
                            />
                            <TouchableOpacity
                                style={{
                                    right: 10,
                                    top: 10,
                                    position: 'absolute',
                                    minHeight: 20,
                                    minWidth: 20,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,

                                    elevation: 4,
                                }}
                                onPress={() => {
                                    setResponse()
                                    img.current = {}
                                }}>
                                <View style={{
                                    borderRadius: 50,
                                    backgroundColor: "#4c4c4c"
                                }}>
                                    <AntIcon name={"close"} style={{margin: 1}} size={20} color={"white"}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        }
                        {response.doc &&
                        <View style={styles.doc}>
                            <TouchableOpacity
                                style={{
                                    elevation: 2,
                                    position: 'absolute',
                                    right: 10,
                                    top: 10,
                                    minHeight: 20,
                                    minWidth: 20
                                }}
                                onPress={() => {
                                    setResponse()
                                    img.current = {}
                                }}>
                                <View style={{
                                    borderRadius: 50,
                                    backgroundColor: "#4c4c4c"
                                }}>
                                    <AntIcon name={"close"} style={{margin: 1}} size={20} color={"white"}/>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                borderWidth: 1,
                                borderColor: '#7c7c7c',
                                borderRadius: 10,
                                padding: 20,
                                backgroundColor: 'white',
                                justifyContent: 'center'
                            }}>
                                {response.type === "application/pdf" ?
                                    <>
                                        <AntIcon name={"pdffile1"} style={{}} size={20} color={"#f66"}/>
                                        <Text style={{color: 'black', marginLeft: 10}}>
                                            {response.name}
                                        </Text>
                                    </>
                                    :
                                    <>
                                        <IonIcon name={"document-outline"} style={{}} size={20} color={"black"}/>
                                        <Text style={{color: 'black', marginLeft: 10}}>
                                            {response.name}
                                        </Text>
                                    </>
                                }

                            </View>

                        </View>
                        }
                    </>
                    }
                </>
                }
            </>
        );
    }

    const customOnPress = (text, onSend) => {
        onSend({text: text.trim()}, true)
    }

    useFocusEffect(
        React.useCallback(() => {
                Colors.primary = Colors.primary;
                if (props.item.chat_sector_id !== sector && sector !== -1) {
                    props = {
                        item: {
                            chat_sector_id: sector
                        }
                    }
                }
                get();
            }
            , [chat]),
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
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>

                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: Texts.title}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>{title.current} </Text>
                            </View>
                        </View>
                        {/*<View style={styles.response}>*/}
                        {/*    <Text>Res: {JSON.stringify(response?.uri)}</Text>*/}
                        {/*</View>*/}
                        {/*{moreVisible &&*/}
                        {/*<TouchableOpacity*/}
                        {/*    style={{*/}
                        {/*        backgroundColor: 'white',*/}
                        {/*        borderWidth: 2,*/}
                        {/*        borderColor: '#737373',*/}
                        {/*        alignItems: 'center',*/}
                        {/*        padding: 10,*/}
                        {/*        justifyContent: 'center'*/}
                        {/*    }}*/}
                        {/*    onPress={() => {*/}
                        {/*        get(true)*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    {loading ?*/}
                        {/*        <ActivityIndicator size="small" color={Colors.primary}/>*/}
                        {/*        :*/}
                        {/*        <Text style={{fontSize: 17, color: Colors.primary}}>*/}
                        {/*            Carregar mensagens anteriores...*/}
                        {/*        </Text>*/}
                        {/*    }*/}

                        {/*</TouchableOpacity>*/}
                        {/*}*/}

                        <GiftedChat
                            locale={"pt-br"}
                            placeholder={"Digite sua menssagem..."}
                            messages={messages}
                            renderSend={({onSend, text, sendButtonProps, ...props}) =>
                                <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        style={{
                                            marginRight: 10,
                                            marginBottom: 10,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        onPress={() => setIsVisible(true)}>
                                        <IonIcon name={"attach"} style={{marginTop: 9}} size={28}
                                                 color={Colors.primary}/>
                                    </TouchableOpacity>

                                    {sendLoading ?
                                        <View style={styles.send}>
                                            <ActivityIndicator size="small" color={'white'}/>
                                        </View>
                                        :
                                        <Send {...props} containerStyle={{position: 'relative', alignItems: "center",
                                            justifyContent: "center"}} sendButtonProps={{
                                            ...sendButtonProps,

                                            onPress: () => customOnPress(text, onSend)
                                        }}>
                                            <View style={styles.send} >
                                                <IonIcon name={"md-send"}
                                                         size={screenWidth * 0.048} color={'white'}/>
                                            </View>


                                        </Send>
                                    }

                                </View>
                            }
                            alwaysShowSend={true}
                            onSend={(messages) => {
                                if (messages[0].text) {
                                    onSend(messages)
                                } else {
                                    send()
                                }

                            }}

                            renderChatFooter={renderChatFooter}
                            renderBubble={renderMessage}
                            // renderCustomView={renderCustomView}
                            user={user.current}
                        />

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isDenied}
                            onRequestClose={() => {
                                setIsDenied(false);
                            }}
                        >
                            <TouchableOpacity style={[styles.modal,]} onPress={() => setIsDenied(false)}>
                                <View style={[styles.card, {flexDirection: 'column'}]}>
                                    <Text>É necessário autorizar o uso da câmera em ajustes.</Text>
                                    <View style={{flexDirection: 'row', margin: 10}}>
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: 1,
                                                borderColor: '#1e61f5',
                                                borderRadius: 10,
                                                padding: 10,
                                                marginHorizontal: 5
                                            }}
                                            onPress={() => {
                                                openSettings().then((e) => console.log(e))
                                                    .catch(() => console.warn('cannot open settings'))
                                                setIsDenied(false)
                                            }}>
                                            <Text style={{textAlign: 'center', color: '#1e61f5'}}>
                                                Ajustes
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: '#e73c51',
                                            borderRadius: 10,
                                            padding: 10,
                                            marginHorizontal: 5
                                        }} onPress={() => setIsDenied(false)}>
                                            <Text style={{textAlign: 'center', color: '#e73c51'}}>
                                                Cancelar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </TouchableOpacity>

                        </Modal>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isVisible}
                            onRequestClose={() => {
                                setIsVisible(false);
                            }}
                        >
                            <TouchableOpacity style={[styles.modal,]} onPress={() => setIsVisible(false)}>
                                <View style={styles.card}>
                                    <TouchableOpacity style={styles.opt}
                                                      onPress={() => {
                                                          setIsVisible(false)
                                                          if (Platform.OS === 'ios') {
                                                              checkPermission('cam')
                                                          } else {
                                                              requestCameraPermission('cam')
                                                          }
                                                      }}>
                                        <View style={[styles.opt2, {backgroundColor: '#ec407a'}]}>
                                            <MAIcon name={"photo-camera"} style={{}} size={35}
                                                    color={'white'}/>
                                        </View>
                                        <Text style={{fontSize: 12, color: Colors.primary}}>
                                            Camera
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.opt}
                                                      onPress={() => {
                                                          setIsVisible(false)
                                                          getImage('image')
                                                      }}>
                                        <View style={[styles.opt2, {backgroundColor: '#bf59cf'}]}>
                                            <IonIcon name={"md-image"} style={{}} size={35} color={'white'}/>
                                        </View>
                                        <Text style={{fontSize: 12, color: Colors.primary}}>
                                            Galeria
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.opt]}
                                                      onPress={() => {
                                                          getDoc()
                                                      }}>
                                        <View style={[styles.opt2, {backgroundColor: '#5f66cd'}]}>
                                            <IonIcon name={"md-document"} style={{}} size={35}
                                                     color={"white"}/>
                                        </View>
                                        <Text style={{fontSize: 12, color: Colors.primary}}>
                                            Documento
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                )
            }
        </>
    );
}

const styles = StyleSheet.create(
    {
        send: {
            borderRadius: 40,
            backgroundColor: Colors.primary,
            padding: 10,
            paddingLeft: 11,
            height: screenWidth * 0.11,
            width: screenWidth * 0.11,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 1,
            marginRight: 1
        },
        doc: {
            height: '25%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#c1c1c1',
        }, image: {
            height: '50%',
            paddingRight: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#c1c1c1',
            marginBottom: 8
        },
        opt: {
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center'
        },
        opt2: {
            borderRadius: 50,
            padding: 20
        },
        modal: {
            flex: 1,
            backgroundColor: "rgba(60, 60, 60, 0.5)", justifyContent: "flex-end", alignItems: "center",
        },
        card: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 10,
            padding: 15,
            alignItems: "center",
            shadowColor: "#000",
            flexDirection: 'row',
            shadowOffset:
                {
                    width: 0,
                    height:
                        2,
                },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginBottom: 50
        }
    });
