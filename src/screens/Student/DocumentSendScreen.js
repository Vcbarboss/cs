import React, {useState, useCallback, useEffect, useRef} from "react";
import {GiftedChat} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import Loading from "../../components/Loading";
import {
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    ActivityIndicator
} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import {Texts} from "../../helpers/Texts";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Toast from "../../components/Toast";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {useDispatch} from "react-redux";
import {Badge,} from "react-native-paper";
import Field2 from "../../components/Field2";
import Field from "../../components/Field";
import MAIcon from "react-native-vector-icons/MaterialIcons";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImagePicker from "react-native-image-crop-picker";
import ImgToBase64 from "react-native-image-base64";
import imm from "../../assets/imgs/logo.png";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

const imgExtension = [
    'png', 'jpg', 'jpeg'
]

export function DocumentSendScreen({route, navigation}) {
    const [loading, setLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [pending, setPending] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleInfo, setIsVisibleInfo] = useState(false)
    const [isVisibleDelete, setIsVisibleDelete] = useState(false)
    const [objToSend, setObjToSend] = useState()
    const [data, setData] = useState([])
    const pendingList = useRef([])
    const api = useApi();
    const refNotification = useRef();
    const [uri, setUri] = useState();
    const type_id = useRef()
    const props = route.params;

    const getData = async () => {
        setLoading(true)
        pendingList.current = []
        try {
            const res = await api.get(`app/enrollment/${props.item.enrollment_id}/document-type/list`);
            const res1 = await api.get(`app/enrollment/${props.item.enrollment_id}/document/list`);
            setData(res1.object)
            setPending(res.object)
            for (let i = 0; i < res1.object.length; i++) {
                pendingList.current.push(res1.object[i].document_type_id)
            }
            console.log(res1)
            setLoading(false)
        } catch (e) {
            console.log(e)
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setLoading(false)
        }
    }

    const delDoc = async () => {
        setSendLoading(true)
        try {
            const res = await api.del(`app/enrollment/${props.item.enrollment_id}/document/${type_id.current}`);
            setIsVisibleDelete(false)
            setSendLoading(false)
            getData()
        } catch (e) {
            console.log(e)
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setIsVisibleDelete(false)
            setSendLoading(false)
        }
    }

    const sendDoc = async () => {
        setSendLoading(true)
        try {
            const res = await api.post(`app/enrollment/${props.item.enrollment_id}/document`, objToSend);

            setIsVisibleInfo(false)
            setIsVisible(false)

            setSendLoading(false)
            getData()
        } catch (e) {
            console.log(e)
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setIsVisibleInfo(false)
            setIsVisible(false)
            setSendLoading(false)
        }
    }

    const getDoc = async (mode) => {
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.images,
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
                    setObjToSend({
                        name: res.name,
                        uri: res.uri,
                        document_type_id: type_id.current,
                        document_base64: data,
                        document_extension: res.type.split('/')[1]
                    })
                })


                .catch(err => console.log(err));


            setIsVisibleInfo(true)
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

    const getImage = (mode) => {
        {
            mode === 'image' &&
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                },
                (response) => {

                    if (response.uri) {
                        crop(response.uri)
                    }
                },
            )
        }
    }

    const crop = async (uri) => {
        const options = {quality: 0.5, base64: true};
        ImagePicker.openCropper({
            path: uri,
            width: 300,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true,
            cropperToolbarTitle: 'Recortar Imagem',
            cropperStatusBarColor: Colors.primary
        }).then(image => {
            setLoading(true)
            setEdit({...edit, avatar: image.path})
            setResponse(image.path)
            ImgToBase64.getBase64String(image.path)
                .then(base64String => {

                    setEdit({
                        ...edit,
                        [`avatar_base64`]: base64String
                    })
                })
                .catch(err => console.log(err));
            setIsVisible(false)
            setIsVisibleInfo(true)
            setLoading(false)
        });

    };

    useFocusEffect(
        React.useCallback(() => {
            getData()
        }, []),
    );

    return (
        <>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <>
                        <Toast ref={refNotification}/>
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: Texts.title}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>Envio de Documento </Text>
                            </View>
                        </View>
                        <ScrollView contentContainerStyle={{flexGrow: 1,}}
                                    style={{padding: 20, backgroundColor: 'white'}}>
                            <View style={{flex: 1}}>

                                <Text style={{fontSize: 18, marginLeft: 5, textAlign: 'center'}}>
                                    Envie aqui os documentos do aluno
                                </Text>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    {pending?.map((item, index) =>
                                        <View key={index}>
                                            {pendingList.current.includes(item.document_type_id) ?
                                                <>
                                                    {data?.map((it, ind) =>
                                                        <View key={ind}>
                                                            {it.document_type_id === item.document_type_id &&

                                                            <TouchableOpacity

                                                                style={{
                                                                    flexDirection: 'row',
                                                                    borderWidth: 1,
                                                                    borderColor: '#fa8c16',
                                                                    borderRadius: 10,
                                                                    padding: 20,
                                                                    backgroundColor: 'white',
                                                                    justifyContent: 'center',
                                                                    marginVertical: 10,
                                                                }}
                                                                onPress={() => {
                                                                    type_id.current = it.enrollment_document_id
                                                                    setIsVisibleDelete(true)
                                                                }}>

                                                                <Text style={{
                                                                    color: '#fa8c16',
                                                                    fontSize: 17,
                                                                    textAlign: 'center'
                                                                }}>
                                                                    {it.document_type?.description}
                                                                </Text>
                                                                <IonIcon name={"time-outline"}
                                                                         style={{
                                                                             position: 'absolute',
                                                                             right: 5,
                                                                             top: "80%"
                                                                         }} size={25}
                                                                         color={'#fa8c16'}/>
                                                            </TouchableOpacity>
                                                            }
                                                        </View>
                                                    )}
                                                </>
                                                :
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'column',
                                                        borderWidth: 1,
                                                        borderColor: '#7c7c7c',
                                                        borderRadius: 10,
                                                        padding: 20,
                                                        backgroundColor: 'white',
                                                        justifyContent: 'center',
                                                        marginVertical: 10,
                                                    }}
                                                    onPress={() => {
                                                        type_id.current = item.document_type_id,
                                                            getDoc()
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: Colors.primary,
                                                            fontSize: 17,
                                                            textAlign: 'center'
                                                        }}>
                                                        {item.description}
                                                    </Text>
                                                </TouchableOpacity>
                                            }

                                        </View>
                                    )}
                                </View>

                            </View>

                        </ScrollView>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isVisibleInfo}
                            onRequestClose={() => {
                                setIsVisibleInfo(false);
                            }}
                        >
                            <TouchableOpacity style={[styles.modal,]} onPress={() => setIsVisibleInfo(false)}>
                                <View style={[styles.card, {flexDirection: 'column',}]}>
                                    <View style={{flexDirection: 'row', marginVertical: 15}}>
                                        <Text style={{fontWeight: 'bold', color: Colors.primary}}>Titulo: </Text>
                                        <Text>{objToSend?.name}</Text>
                                    </View>
                                    {/*{imgExtension.includes(objToSend?.document_extension) &&*/}
                                    {/*<Image source={{uri: objToSend.uri}} style={styles.img}/>*/}
                                    {/*}*/}
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{
                                            borderWidth: 2,
                                            borderRadius: 15,
                                            borderColor: Colors.primary,
                                            padding: 10,
                                            margin: 10,
                                            backgroundColor: Colors.primary
                                        }} onPress={() => sendDoc()}>
                                            {sendLoading ?
                                                <View style={{flex: 1, width: 40}}>

                                                    <ActivityIndicator size="small" color={'white'}/>
                                                </View>
                                                :
                                                <Text style={{color: 'white', textAlign: 'center'}}>Enviar</Text>
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            borderWidth: 2,
                                            borderRadius: 15,
                                            borderColor: Colors.red,
                                            padding: 10,
                                            margin: 10,
                                            backgroundColor: Colors.red
                                        }} onPress={() => {
                                            setIsVisibleInfo(false)
                                            setIsVisible(false)
                                        }}>
                                            <Text style={{color: 'white', textAlign: 'center'}}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </Modal>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isVisibleDelete}
                            onRequestClose={() => {
                                setIsVisibleDelete(false);
                            }}
                        >
                            <TouchableOpacity style={[styles.modal,]} onPress={() => setIsVisibleDelete(false)}>
                                <View style={[styles.card, {flexDirection: 'column', padding: 20}]}>
                                    <Text style={{fontWeight: 'bold', color: Colors.primary}}>Deseja cancelar este
                                        envio?</Text>
                                    <View style={{flexDirection: 'row', marginVertical: 10}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity style={{
                                                borderWidth: 2,
                                                borderRadius: 15,
                                                borderColor: Colors.primary,
                                                padding: 10,
                                                margin: 10,
                                                backgroundColor: Colors.primary
                                            }} onPress={() => delDoc()}>
                                                {sendLoading ?
                                                    <View style={{flex: 1, width: 40}}>

                                                        <ActivityIndicator size="small" color={'white'}/>
                                                    </View>
                                                    :
                                                    <Text style={{color: 'white', textAlign: 'center'}}>Sim</Text>
                                                }
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{
                                                borderWidth: 2,
                                                borderRadius: 15,
                                                borderColor: Colors.red,
                                                padding: 10,
                                                margin: 10,
                                                backgroundColor: Colors.red
                                            }} onPress={() => {
                                                setIsVisibleDelete(false)
                                            }}>
                                                <Text style={{color: 'white', textAlign: 'center'}}>Não</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    itemList: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#eaebef",
        marginVertical: 5,
        borderRadius: 15,
        minWidth: screenWidth * 0.475,
        height: 120,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        padding: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
    },
    title: {
        fontSize: Texts.listTitle,
        fontWeight: "bold",
        marginVertical: 5,
        color: Colors.primary,
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
        justifyContent: "center",
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
    },
    img: {
        resizeMode: 'contain',
        maxHeight: 200,
        maxWidth: '50%',
        flex: 1
    },
});
