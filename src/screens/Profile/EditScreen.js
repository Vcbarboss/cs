import React, {useState, useRef} from "react";
import {
    Image,
    StatusBar,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
    SafeAreaView, Modal, PermissionsAndroid, Platform, KeyboardAvoidingView
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import {useSelector} from "react-redux";
import {Env} from "../../Env";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import moment from "moment";
import "moment/locale/pt-br";
import Field from "../../components/Field";
import {maskDate, maskDate2, maskPhone, maskViewPhone} from "../../helpers/Functions";
import SelectField from "../../components/SelectField";
import Loading from "../../components/Loading";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import IonIcon from "react-native-vector-icons/Ionicons";
import ImgToBase64 from 'react-native-image-base64';
import {Avatar} from "react-native-paper";
import MAIcon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from 'react-native-image-crop-picker';
import placeholder from "../../assets/imgs/user-placeholder-300x300.jpg";
import {openSettings, check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const screenHeight = Math.round(Dimensions.get("window").height);

const optGender = [
    {label: "Selecione seu gênero...", value: null},
    {label: "Masculino", value: "MASCULINO"},
    {label: "Feminino", value: "FEMININO"},
];

export function EditScreen({navigation}) {

    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [response, setResponse] = useState()
    const api = useApi({navigation});
    const refNotification = useRef();
    const [isVisible, setIsVisible] = useState(false)
    const [isDenied, setIsDenied] = useState(false)
    const user = useSelector((state) => state).userReducer;
    const [data, setData] = useState();
    const [edit, setEdit] = useState();

    const getData = async () => {
        setLoading(true);
        try {
            const res = await api.get("app/me");
            setData({
                natural_birthday: moment(res.object?.natural_birthday).format("L"),
                natural_gender: res.object?.natural_gender,
                contact_business_phone: res.object?.contact_business_phone,
                contact_home_phone: res.object?.contact_home_phone,
                contact_mobile_phone: res.object?.contact_mobile_phone,
                contact_mail: res.object?.contact_mail,
            });
            setEdit({
                natural_birthday: moment(res.object?.natural_birthday).format("L"),
                natural_gender: res.object?.natural_gender,
                contact_business_phone: res.object?.contact_business_phone,
                contact_home_phone: res.object?.contact_home_phone,
                contact_mobile_phone: res.object?.contact_mobile_phone,
                contact_mail: res.object?.contact_mail,
                avatar: res.object?.avatar
            });
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

    const handleChange = (name, e) => {
        if (name.includes("phone")) {
            setEdit({...edit, [name]: e.replace(/\D/g, "")});
            setData({...edit, [name]: e.replace(/\D/g, "")});

        } else {
            setEdit({...edit, [name]: e});
            setData({...edit, [name]: e});
        }
    };

    const handleEdit = async () => {
        setLoadingConfirm(true)
        try {
            const res = await api.put("app/me", edit);
            navigation.pop();
            setLoadingConfirm(false)
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            setLoadingConfirm(false)
        }
    };

    const requestCameraPermission = async (mode) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getImage(mode)
            } else {
            }
        } catch (err) {
            console.warn(err);
        }
    };

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
            setLoading(false)
        });

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
                    if (response?.errorCode === 'permission') {

                        // openSettings().catch(() => console.warn('cannot open settings'));
                    } else {
                        console.log(response)
                        if (response.uri) {

                            crop(response.uri)
                        }
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
                    console.log(response)
                    if (response.uri) {
                        crop(response.uri)
                    }
                },
            )
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getData();
        }, []),
    );

    return (
        <>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <View style={styles.container}>
                        <KeyboardAvoidingView
                            behavior={"padding"}
                            enabled={Platform.OS === "ios"}
                            style={{flex: 1}}
                        >
                            <Toast ref={refNotification}/>
                            <GeneralStatusBarColor backgroundColor={Colors.primary}
                                                   barStyle="light-content"/>
                            {/*<StatusBar*/}
                            {/*  backgroundColor={Colors.primary}*/}
                            {/*  barStyle="light-content"*/}
                            {/*/>*/}
                            <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>
                                <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                    <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                                </TouchableOpacity>
                                <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                    <Text style={{color: "white", fontSize: 23,}}>Construindo o Saber</Text>
                                    <Text style={{color: "white", fontSize: Texts.subtitle,}}>Editar perfil </Text>
                                </View>
                                {/*<TouchableOpacity style={{*/}
                                {/*    marginRight: 10,*/}
                                {/*    marginBottom: 10,*/}
                                {/*    alignItems: "center",*/}
                                {/*    justifyContent: "center"*/}
                                {/*}}*/}
                                {/*                  onPress={() => {*/}
                                {/*                  }}>*/}
                                {/*    <IonIcon name={"camera-outline"} style={{marginTop: 10}} size={27} color={'white'}/>*/}
                                {/*</TouchableOpacity>*/}
                            </View>

                            <ScrollView style={{paddingHorizontal: 15}}>
                                <View style={{
                                    paddingHorizontal: 10,
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <View style={{
                                        alignItems: "center",
                                        margin: 10,
                                        marginBottom: 30
                                    }}>

                                        <TouchableOpacity onPress={() =>
                                            setIsVisible(true)
                                        }>

                                            {edit?.avatar || response ?

                                                <Avatar.Image size={120}
                                                              source={{uri: response ? response : edit?.avatar}}/>
                                                :
                                                <Image source={placeholder} style={{width: 120, height: 120}}/>
                                            }
                                            <View style={{position: 'absolute', right: 0, top: 0}}>
                                                <View style={{
                                                    elevation: 1,
                                                    padding: 5,
                                                    marginTop: 10,
                                                    backgroundColor: 'white',
                                                    borderRadius: 50
                                                }}>
                                                    <AntIcon name={"edit"} size={15} color={"#707070"}/>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                    <View>
                                        <Field
                                            icon={"calendar-outline"}
                                            keyboardType={"number-pad"}
                                            placeholder={"Sua data de nascimento"}
                                            value={edit?.natural_birthday ? maskDate(edit?.natural_birthday) : maskDate(data?.natural_birthday)}
                                            label={"Data de Nascimento"}
                                            change={(e) => handleChange("natural_birthday", e)}/>
                                    </View>
                                    <View>
                                        <SelectField icon={"male-female"} label={"Gênero"}
                                                     initialValue={edit?.natural_gender ? edit?.natural_gender : data?.natural_gender}
                                                     placeholder={edit?.natural_gender ? edit?.natural_gender : data?.natural_gender}
                                                     list={optGender}
                                                     change={(e) => handleChange("natural_gender", e)}/>
                                    </View>
                                    <View>
                                        <Field
                                            icon={"home-outline"}
                                            keyboardType={"number-pad"}
                                            placeholder={"Seu telefone residencial"}
                                            value={edit?.contact_home_phone ? maskPhone(edit?.contact_home_phone) : maskPhone(data?.contact_home_phone)}
                                            label={"Telefone Residencial"}
                                            change={(e) => handleChange("contact_home_phone", e)}/>
                                    </View>
                                    <View>
                                        <Field
                                            icon={"call-outline"}
                                            keyboardType={"number-pad"}
                                            placeholder={"Seu telefone celular"}
                                            value={edit?.contact_mobile_phone ? maskPhone(edit?.contact_mobile_phone) : maskPhone(data?.contact_mobile_phone)}
                                            label={"Telefone Celular"}
                                            change={(e) => handleChange("contact_mobile_phone", e)}/>
                                    </View>
                                    <View>
                                        <Field
                                            icon={"mail-outline"}
                                            placeholder={"Seu Email"}
                                            value={edit?.contact_mail ? edit?.contact_mail : data?.contact_mail}
                                            label={"Seu email"}
                                            change={(e) => handleChange("contact_mail", e)}/>
                                    </View>

                                    <View>
                                        <Field
                                            icon={"business"}
                                            keyboardType={"number-pad"}
                                            placeholder={"Seu Telefone de Trabalho"}
                                            value={edit?.contact_business_phone ? maskPhone(edit?.contact_business_phone) : maskPhone(data?.contact_business_phone)}
                                            label={"Telefone de Trabalho"}
                                            change={(e) => handleChange("contact_business_phone", e)}/>
                                    </View>


                                </View>
                            </ScrollView>
                            <View style={{display: "flex", paddingHorizontal: 10}}>
                                <ButtonStyle1
                                    text={"Confirmar"}
                                    style={{margin: 3, padding: 8}}
                                    loading={loadingConfirm}
                                    primaryColor={Colors.primary}
                                    secondaryColor={Colors.primary}
                                    color={'white'}
                                    borderRadius={15}
                                    onPress={() => {
                                        handleEdit();
                                    }}
                                />
                            </View>
                        </KeyboardAvoidingView>
                    </View>

                )}
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
                                              if (Platform.OS === "ios") {
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
                                              // setIsVisible(false)
                                              getImage('image')
                                          }}>
                            <View style={[styles.opt2, {backgroundColor: '#bf59cf'}]}>
                                <IonIcon name={"md-image"} style={{}} size={35} color={'white'}/>
                            </View>
                            <Text style={{fontSize: 12, color: Colors.primary}}>
                                Galeria
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        color: Colors.primary,
    },
    subTitle: {
        fontSize: 19,
        marginBottom: 5,
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
    logo: {
        width: "100%",
        resizeMode: "contain", flex: 1,
    },
});
