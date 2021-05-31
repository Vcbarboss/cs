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
    SafeAreaView,
    Platform, KeyboardAvoidingView
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import {useSelector} from "react-redux";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import moment from "moment";
import Field from "../../components/Field";
import {maskDate, maskPhone,} from "../../helpers/Functions";
import useAuth from "../../hooks/Auth";
import SelectField from "../../components/SelectField";
import GeneralStatusBarColor from "../../components/StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);

const optGender = [
    {label: "Masculino", value: "MASCULINO"},
    {label: "Feminino", value: "FEMININO"},
];


export function FirstLoginScreen({navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const user = useSelector((state) => state).userReducer;
    const {logoutWithoutApi, updateContactInfo} = useAuth();
    const [data, setData] = useState();
    const [edit, setEdit] = useState();

    const doLogout = async () => {
        try {
            const res = await api.get('app/logout')
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

        }
        logoutWithoutApi();
        navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen', params: {order: 0}}],
        });
    };

    const getData = async () => {
        try {
            const res = await api.get("app/me");
            setEdit({
                natural_birthday: moment(res.object?.natural_birthday).format("L"),
                natural_gender: res.object?.natural_gender,
            });
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

        }
    };

    const handleChange = (name, e) => {
        if (name.includes('phone')) {
            setEdit({...edit, [name]: e.replace(/\D/g, "")});
        } else {
            setEdit({...edit, [name]: e});
        }

    };

    const handleEdit = async () => {

        try {
            const res = await api.put("app/me", edit);
            updateContactInfo(edit.contact_mobile_phone, edit.contact_mail)

            navigation.reset({index: 0, routes: [{name: "HomeStack"}]});
        } catch (e) {
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");


        }
    };

    useFocusEffect(
        React.useCallback(() => {

            getData()
        }, []),
    );

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={"padding"}
                enabled={Platform.OS === "ios"}
                style={{flex: 1}}
            >
                <Toast ref={refNotification}/>
                <GeneralStatusBarColor backgroundColor={Colors.statusBar}
                                       barStyle="light-content"/>
                {/*<StatusBar*/}
                {/*    backgroundColor={Colors.primary}*/}
                {/*    barStyle="light-content"*/}
                {/*/>*/}
                <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                    <TouchableOpacity style={{}} onPress={() => doLogout()}>
                        <AntIcon name={"arrowleft"} style={{}} size={25} color={"white"}/>
                    </TouchableOpacity>
                    <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10}}>

                        <Text style={{
                            color: "white",
                            fontSize: Texts.title,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>CONSTRUINDO O
                            SABER</Text>
                        <Text style={{
                            color: "#8b98ae",
                            fontSize: Texts.subtitle,
                            textAlign: 'center'
                        }}>Contato</Text>

                    </View>
                    <TouchableOpacity style={{width: 26, marginTop: 10, alignItems: "flex-end"}}
                                      onPress={() => {
                                      }}>

                    </TouchableOpacity>
                </View>

                <ScrollView style={{paddingHorizontal: 15}}>
                    <View style={{
                        paddingHorizontal: 10,
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                        <View style={{margin: 20,}}>
                            <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}> Por favor, preencha
                                seus dados para prosseguir.</Text>
                        </View>

                        <View>
                            <Field
                                icon={"call-outline"}
                                placeholder={"Sua data de nascimento"}
                                value={edit?.natural_birthday}
                                label={"Data de Nascimento"}
                                change={(e) => handleChange("contact_mobile_phone", maskDate(e))}/>
                        </View>

                        <View>
                            <SelectField icon={"male-female"} label={"Gênero"}
                                         initialValue={edit?.natural_gender}
                                         placeholder={"Selecione seu gênero..."}
                                         list={optGender}
                                         change={(e) => handleChange("natural_gender", e)}/>
                        </View>

                        <View>
                            <Field
                                icon={"call-outline"}
                                keyboardType={"number-pad"}
                                placeholder={"Seu telefone celular"}
                                value={maskPhone(edit?.contact_mobile_phone)}
                                label={"Telefone Celular"}
                                change={(e) => handleChange("contact_mobile_phone", e)}/>
                        </View>
                        <View>
                            <Field
                                icon={"mail-outline"}
                                placeholder={"Seu Email"}
                                value={edit?.contact_mail}
                                label={"Seu email"}
                                change={(e) => handleChange("contact_mail", e)}/>
                        </View>

                    </View>
                </ScrollView>
                <View style={{display: "flex", paddingHorizontal: 10}}>
                    <ButtonStyle1
                        text={"Confirmar"}
                        style={{margin: 3, padding: 8}}
                        loading={loading}
                        primaryColor={Colors.primary}
                        secondaryColor={Colors.primary}
                        color={Colors.white}
                        borderRadius={15}
                        onPress={() => {
                            handleEdit();
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
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
});
