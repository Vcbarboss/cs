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
    SafeAreaView, Platform, KeyboardAvoidingView
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
import Field from "../../components/Field";
import GeneralStatusBarColor from "../../components/StatusBarColor";

const screenHeight = Math.round(Dimensions.get("window").height);

export function ChangePasswordScreen({navigation}) {

    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [err, setErr] = useState();
    const api = useApi({navigation});
    const refNotification = useRef();
    const user = useSelector((state) => state).userReducer;

    useFocusEffect(
        React.useCallback(() => {

        }, []),
    );

    const handleChange = async () => {


        if (!(newPassword && currentPassword)) {
            refNotification.current.showToast("warning", "Preencha corretamente todos os campos!");
        } else if (currentPassword.length < 4) {
            refNotification.current.showToast("warning", "Senha atual incorreta!");
        } else if (newPassword.length < 6) {
            refNotification.current.showToast("warning", "Sua nova senha deve ter de 6 a 20 caracteres!");
        } else {

            const objToSend = {
                password_current: currentPassword,
                password_set: newPassword,
                identifier: Env.identifier,
            };
            setLoading(true);
            try {
                const res = await api.put("app/set-password", objToSend);
                navigation.pop();
            } catch (e) {
                let aux;
                for (let i = 0; i < Object.keys(e.validator).length; i++) {
                    aux = e.validator[Object.keys(e.validator)[i]][0];
                    break;
                }
                refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");
            }
        }
        setLoading(false);
    };

    return (
        <>
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
                    {/*    backgroundColor={Colors.primary}*/}
                    {/*    barStyle="light-content"*/}
                    {/*/>*/}
                    <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                        <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                            <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                        </TouchableOpacity>
                        <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                            <Text style={{color: "white", fontSize: Texts.title}}>Construindo o Saber</Text>
                            <Text style={{color: "white", fontSize: Texts.subtitle}}> Trocar Senha </Text>
                        </View>
                        <TouchableOpacity style={{alignItems: "flex-end", justifyContent: "center"}}>

                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{padding: 15}}>
                        <View style={{
                            padding: 10,
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}>

                            <Field
                                placeholder="Senha Atual"
                                label={"Senha Atual"}
                                value={currentPassword}
                                change={(e) => setCurrentPassword(e)}
                                secureTextEntry={true}
                                icon={"key"}
                            />

                            <Field
                                placeholder="Nova Senha"
                                label={"Nova Senha"}
                                value={newPassword}
                                secureTextEntry={true}
                                change={(e) => setNewPassword(e)}
                                icon={"key"}
                            />

                        </View>
                    </ScrollView>
                    <View style={{display: "flex", paddingHorizontal: 10}}>
                        <ButtonStyle1
                            text={"Trocar Senha"}
                            style={{margin: 3, padding: 8}}
                            loading={loading}
                            primaryColor={Colors.primary}
                            secondaryColor={Colors.primary}
                            color={"white"}
                            borderRadius={15}
                            onPress={() =>
                                handleChange()
                            }
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
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
});
