import React, {useState, useCallback, useEffect, useRef} from "react";
import {GiftedChat} from "react-native-gifted-chat";
import "dayjs/locale/pt-br";
import Loading from "../../components/Loading";
import {Text, TouchableOpacity, View, ScrollView, StyleSheet, Dimensions} from "react-native";
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

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function DocumentSendScreen({navigation}) {
    const [loading, setLoading] = useState(false);
    const api = useApi();
    const refNotification = useRef();
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            Colors.theme = Colors.primary;

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
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: 23}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>Envio de Documento </Text>
                            </View>
                        </View>
                        <ScrollView style={{padding: 20, backgroundColor: 'white'}}>


                            <View style={{flex: 1}}>
                                <Field
                                    label={'Nome do documento'}
                                    placeholder={'Nome do documento...'}
                                    change={(e) => {
                                        console.log(e)
                                    }}
                                />
                            </View>
                            <View>
                                <TouchableOpacity style={{
                                    borderWidth: 2,
                                    borderRadius: 15,
                                    borderColor: Colors.primary,
                                    padding: 10,
                                    marginVertical: 10,
                                    backgroundColor: Colors.primary
                                }}>
                                    <Text style={{color: 'white', fontSize: 15}}>Selecionar documento</Text>
                                </TouchableOpacity>
                                <Text style={{marginLeft: 5}}>
                                    Documentos selecionados...
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: '#7c7c7c',
                                    borderRadius: 10,
                                    padding: 20,
                                    maxWidth: screenWidth * 0.8,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    marginVertical: 10,
                                }}>
                                    <IonIcon name={"document-outline"} style={{}} size={20} color={"black"}/>
                                    <Text style={{color: Colors.primary, fontSize: 17}}>Certidão de Nascimento</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: '#7c7c7c',
                                    borderRadius: 10,
                                    padding: 20,
                                    maxWidth: screenWidth * 0.8,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    marginVertical: 10,
                                }}>
                                    <IonIcon name={"document-outline"} style={{}} size={20} color={"black"}/>
                                    <Text style={{color: Colors.primary, fontSize: 17}}>Carteira de Vacinação</Text>
                                </View>
                            </View>

                        </ScrollView>
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
});
