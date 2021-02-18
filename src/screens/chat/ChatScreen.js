import React, {useState, useCallback, useEffect, useRef} from "react";
import {Bubble, GiftedChat, InputToolbar, Message, Send} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import {StyleSheet, Linking, Text, TouchableOpacity, View, Image, Modal, Dimensions} from "react-native";
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

const image = ['png', 'jpg', 'jpeg']
const docs = ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx']

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function ChatScreen({route, navigation}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCam, setIsCam] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
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
    const cameraRef = useRef();
    const [response, setResponse] = React.useState(null);
    const imagePath = useRef(undefined);

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
                    res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list${"?last_id=" + msg_id.current}`);
                } else {
                    setMessages([]);
                    lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/list`
                    res = await api.get(`app/chat/sector/${props.item.chat_sector_id}/list`);
                }
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
                                doc: docs.includes(short.attachment_extension) && short.attachment_url
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
                                doc: docs.includes(short.attachment_extension) && short.attachment_url
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

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
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

        const objToSend = {
            message: msg,
            attach_name: img.current?.name ? img.current?.name : '',
            attach_base64: img.current?.base64 ? img.current?.base64 : ''
        };
        console.log(objToSend)
        if (props.item.chat_sector_id !== sector && sector !== -1) {
            props = {
                item: {
                    chat_sector_id: sector
                }
            }
        }
        try {
            lastUrl.current = `app/chat/sector/${props.item.chat_sector_id}/send`;
            console.log(lastUrl);
            const res = await api.post(`app/chat/sector/${props.item.chat_sector_id}/send`, objToSend);
            get()
            console.log(res);
            setResponse()
            img.current = {}
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
        console.log(msg[0])
        const obj = {
            ...msg[0],
            image: img.current?.uri
        }
        //setMessages(previousMessages => GiftedChat.append(previousMessages, obj));
        setTimeout(() => {
            console.log(messages);
        }, 1500);

        send(msg[0].text);
    }, []);

    const getDoc = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.docx, DocumentPicker.types.xls, DocumentPicker.types.pdf],
            });

            const fs = RNFetchBlob.fs;
            fs.readFile(res.uri, 'base64')
                .then(data => {
                    img.current = {
                        name: res.name,
                        uri: res.uri,
                        base64: data
                    }
                    setResponse({
                        name: res.name,
                        uri: res.uri,
                        base64: data,
                        photo: false
                    })
                })


                .catch(err => console.log(err));
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
                <TouchableOpacity
                    style={{marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center"}}
                    onPress={() => getDoc()}>
                    <IonIcon name={"attach"} style={{marginTop: 10}} size={27} color={Colors.primary}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={(messages) => {
                    if (props.text) {
                        onSend(props.text)

                    } else {
                        send()
                    }

                }}>
                    <View style={{marginRight: 10, marginBottom: 10, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{textAlign: "center", fontSize: 20, color: Colors.primary}}>
                            Enviar
                        </Text>
                    </View>
                </TouchableOpacity>
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
                {props.currentMessage.doc ?
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
                    {response &&
                    <>
                        {response.image ?
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
                            :
                            <View style={styles.doc}>
                                <TouchableOpacity style={{position: 'absolute', right: 5, top: 2}}
                                                  onPress={() => setResponse()}>
                                    <AntIcon name={"close"} style={{marginTop: 10}} size={25} color={"white"}/>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row'}}>
                                    <AntIcon name={"pdffile1"} style={{}} size={25} color={"#f66"}/>
                                    <Text style={{color: 'white'}}>
                                        {response.name}
                                    </Text>
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
                Colors.theme = Colors.primary;
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
                                              onPress={() => launchCamera(
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
                            renderSend={({onSend, text, sendButtonProps, ...props}) =>
                                <>
                                    <TouchableOpacity
                                        style={{
                                            marginRight: 10,
                                            marginBottom: 10,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        onPress={() => setIsVisible(true)}>
                                        <IonIcon name={"attach"} style={{marginTop: 10}} size={30}
                                                 color={Colors.primary}/>
                                    </TouchableOpacity>
                                    <Send {...props} containerStyle={{}} sendButtonProps={{
                                        ...sendButtonProps,

                                        onPress: () => customOnPress(text, onSend)
                                    }}>
                                        <IonIcon name={"md-send"}
                                                 style={{
                                                     borderRadius: 40,
                                                     backgroundColor: Colors.primary,
                                                     padding: 10,
                                                     paddingLeft: 11,
                                                     height: screenWidth * 0.12,
                                                     width: screenWidth * 0.12,
                                                     alignItems: 'center',
                                                     justifyContent: 'center',
                                                     marginBottom: 1,
                                                     marginRight: 1
                                                 }} size={27} color={'white'}/>
                                    </Send>
                                </>
                            }
                            alwaysShowSend={true}
                            onSend={(messages) => {
                                if (messages[0].text) {
                                    console.log(messages)
                                    onSend(messages)
                                } else {
                                    send()
                                }

                            }}
                            //renderSend={renderSend}
                            renderChatFooter={renderChatFooter}
                            renderBubble={renderMessage}
                            // renderCustomView={renderCustomView}
                            user={user.current}
                        />
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
                                    <TouchableOpacity style={styles.opt} onPress={() =>
                                    {
                                        setIsCam(true)
                                    }}>
                                        <View style={[styles.opt2, {backgroundColor: '#ec407a'}]}>

                                            <MAIcon name={"photo-camera"} style={{}} size={35}
                                                    color={'white'}/>

                                        </View>
                                        <Text style={{fontSize: 12, color: Colors.primary}}>
                                            Camera
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.opt} onPress={() => {
                                        setIsVisible(false)
                                        launchImageLibrary(
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
                                        )
                                    }}>
                                        <View style={[styles.opt2, {backgroundColor: '#bf59cf'}]}>
                                            <IonIcon name={"md-image"} style={{}} size={35} color={'white'}/>

                                        </View>
                                        <Text style={{fontSize: 12, color: Colors.primary}}>
                                            Galeria
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.opt]} onPress={() => {
                                        setIsVisible(false)
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
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isCam}
                            onRequestClose={() => {
                                setIsCam(false);
                            }}
                        >
                            <View style={{flex: 1, flexDirection: "column"}}>
                                <RNCamera
                                    ref={camera => {
                                        cameraRef.current = camera;
                                    }}
                                    style={styles.preview}
                                    type={RNCamera.Constants.Type.front}
                                    autoFocus={RNCamera.Constants.AutoFocus.on}
                                    captureAudio={false}
                                    flashMode={RNCamera.Constants.FlashMode.off}
                                    androidCameraPermissionOptions={{
                                        title: 'Permissão para usar a câmera',
                                        message: "Nós precisamos de sua permissão para utilizar sua câmera",
                                        buttonPositive: 'Ok',
                                        buttonNegative: 'Cancelar',
                                    }}
                                />
                                <View style={{flex: 0, flexDirection: "row", justifyContent: "center"}}>
                                    <TouchableOpacity onPress={() => takePicture()} style={{flex: 0, backgroundColor: "#fff", borderRadius: 5, padding: 15, paddingHorizontal: 20, alignSelf: "center", margin: 20}}>
                                        <Text style={styles.buttonText}> Tirar </Text>
                                    </TouchableOpacity>
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
    doc: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7c7c7c'
    },
    image: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7c7c7c'
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
