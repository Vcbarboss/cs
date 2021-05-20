import React, {useState, useRef} from "react";
import {
    Modal,
    StatusBar,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
    SafeAreaView, Image
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Icon from "react-native-vector-icons/Ionicons";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import moment from "moment";
import {Avatar} from "react-native-paper";
import {StudentProfileComponent} from "../../components/StudentProfileComponent";
import Badge from "react-native-paper/src/components/Badge";
import Loading from "../../components/Loading";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import image from "../../assets/imgs/userStudent.png";
import {useSelector} from "react-redux";
import {maskViewPhone} from "../../helpers/Functions";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

export function StudentScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const user = useSelector((state) => state).userReducer;
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false)


    useFocusEffect(
        React.useCallback(() => {
            console.log(user)
        }, []),
    );

    return (
        <>
            {loading ? (
                    <>
                        <Toast ref={refNotification}/>
                        <Loading/>
                    </>
                )
                :
                (
                    <View style={styles.container}>
                        <Toast ref={refNotification}/>
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        {/*<StatusBar*/}
                        {/*    backgroundColor={Colors.primary}*/}
                        {/*    barStyle="light-content"*/}
                        {/*/>*/}
                        <View style={{backgroundColor: Colors.primary,}}>
                            <View style={{
                                flexDirection: "row",
                                padding: 10,
                                borderColor: '#8b98ae',
                                backgroundColor: Colors.primary,
                                borderBottomWidth: 1
                            }}>

                                <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                    <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                                </TouchableOpacity>
                                <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                    <Text style={{color: "white", fontSize: Texts.title, textAlign: 'center', fontWeight: '700'}}>CONSTRUINDO
                                        O SABER</Text>
                                    <Text style={{color: "#8b98ae", fontSize: Texts.subtitle, textAlign: 'center'}}>Área
                                        do aluno </Text>
                                </View>

                            </View>

                            <View style={{
                                backgroundColor: 'white',
                                margin: 10,
                                borderBottomRightRadius: 5,
                                borderBottomLeftRadius: 5,
                                borderTopLeftRadius: 3,
                                borderTopRightRadius: 35,
                                borderTopColor: Colors.tertiary,
                                borderBottomColor: Colors.tertiary,
                                borderTopWidth: 35,
                                borderBottomWidth: 5
                            }}>
                                <View
                                    style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Colors.lightgray}}>
                                    <View style={{flex: 0.7, justifyContent: "center", padding: 20}}>
                                        <Text style={styles.name}>{props?.item.student.person.name.toUpperCase()}</Text>
                                        <Text
                                            style={styles.class}>{moment().diff(props?.item.student.person.natural_birthday, "years") + " anos"}</Text>
                                        <Text style={[styles.class, {}]}>{props?.item.class_room.description}</Text>
                                    </View>
                                </View>
                                <View style={{padding: 5}}>
                                    <Text style={{textAlign: 'center'}}>{maskViewPhone(user.object.person.contact_mobile_phone)}</Text>
                                    <Text style={{textAlign: 'center'}}>{props?.item.student.person.address_street} - {props?.item.student.person.address_district}</Text>
                                </View>


                                {props?.item.student.person.avatar ?
                                    <View style={{
                                        borderWidth: 2,
                                        borderColor: Colors.theme,
                                        backgroundColor: 'white',
                                        borderRadius: 55,
                                        padding: 3,
                                        position: 'absolute',
                                        right: 10,
                                        top: -15
                                    }}>
                                        <Avatar.Image style={{}} size={screenWidth * 0.25}
                                                      source={{uri: props?.item.student.person.avatar}}/>
                                    </View>
                                    :
                                    <View style={{flex: 0.5}}>
                                    </View>
                                }
                            </View>


                        </View>
                        <ScrollView style={{backgroundColor: 'white', elevation: 5, padding: 5}}
                                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>

                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <TouchableOpacity style={[styles.itemList, {borderColor: '#56a6db'}]}
                                                  onPress={() => setIsVisible(true)}>
                                    <Icon name={'person-outline'} size={40} color={'#56a6db'}/>
                                    <Text style={{textAlign: 'center'}}> PERFIL </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemList2, {borderColor: '#f5797b'}]}
                                                  onPress={() => navigation.navigate('StudentNotificationList')}>
                                    <View>
                                        {props.item.push_notification_recipients_count > 0 &&
                                        <Badge size={20} style={{
                                            position: "absolute",
                                            top: -5,
                                            right: -10,
                                            zIndex: 10
                                        }}>{props.item.push_notification_recipients_count}</Badge>}
                                        <AntIcon name={'inbox'} color={'#f5797b'} size={40}/>
                                    </View>
                                    <Text style={{textAlign: 'center'}}> MENSAGENS </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemList, {borderColor: '#8a67b7'}]}
                                                  onPress={() => navigation.navigate('FormListScreen',
                                                      {item: props?.item},
                                                  )}>
                                    <AntIcon name={'form'} color={'#8a67b7'} size={40}/>
                                    <Text style={{textAlign: 'center'}}> FICHAS </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <TouchableOpacity style={[styles.itemList2, {borderColor: '#e1588c'}]}
                                                  onPress={() => navigation.navigate('AuthPersonListScreen',
                                                      {item: props?.item},
                                                  )}>
                                    <View>
                                        {props.item.student.student_auth_person_count > 0 &&
                                        <Badge size={20} style={{
                                            position: "absolute",
                                            top: -5,
                                            right: -10,
                                            zIndex: 10,
                                            backgroundColor: 'blue'
                                        }}>{props.item.student.student_auth_person_count}</Badge>}

                                        <Icon name={'ios-people-outline'} color={'#e1588c'} size={40}/>
                                    </View>

                                    <Text style={{textAlign: 'center'}}> RESPONSÁVEIS </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemList, {borderColor: '#17bb99'}]}
                                                  onPress={() => navigation.navigate('DocumentSendScreen',
                                                      {item: props?.item},
                                                  )}>
                                    <Icon name={'documents-outline'} color={'#17bb99'} size={40}/>
                                    <Text style={{textAlign: 'center'}}> DOCUMENTOS </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.itemList2, {borderColor: '#4f81a2'}]}
                                                  onPress={() => navigation.navigate('ReportScreen',
                                                      {item: props?.item},
                                                  )}>
                                    <Icon name={'ios-receipt-outline'} color={'#4f81a2'} size={40}/>
                                    <Text style={{textAlign: 'center'}}> BOLETIM </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <TouchableOpacity style={[styles.itemList, {borderColor: '#ff8e08'}]}
                                                  onPress={() =>
                                                      navigation.navigate('ClassScheduleScreen',
                                                          {item: props?.item},
                                                      )
                                                  }>
                                    <AntIcon name={'table'} color={'#ff8e08'} size={40}/>
                                    <Text style={{textAlign: 'center'}}> HORÁRIO </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemList2, {borderColor: '#4d908e'}]}
                                                  onPress={() =>
                                                      navigation.navigate('HomeworkListScreen',
                                                          {item: props?.item},
                                                      )
                                                  }>
                                    <MCIcon name={'file-document-edit-outline'} color={'#4d908e'} size={40}/>
                                    <Text style={{textAlign: 'center'}}> TAREFAS </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemList, {borderColor: '#e63946'}]}
                                                  onPress={() =>
                                                      navigation.navigate('AttendanceListScreen',
                                                          {item: props?.item},
                                                      )
                                                  }>
                                    <MCIcon name={'account-check-outline'} color={'#e63946'} size={40}/>
                                    <Text style={{textAlign: 'center'}}> FREQUÊNCIA </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={isVisible}
                            onRequestClose={() => {
                                setIsVisible(false)
                            }}
                        >
                            <StudentProfileComponent data={props.item} close={(e) => setIsVisible(e)}/>
                        </Modal>
                    </View>
                )}
        </>

    );
}

const styles = StyleSheet.create({
    itemList: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#eaebef",
        margin: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderRadius: 15,
        height: 120,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    itemList2: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#eaebef",
        margin: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderRadius: 15,
        height: 120,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    bg: {
        position: "absolute",
        left: 0,
        top: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: Colors.opt1,
    },
    logo: {
        width: "100%",
        resizeMode: "contain", flex: 1,
    },

    logo2: {
        marginTop: 20,
        width: "50%",
        resizeMode: "contain",
        maxHeight: 60,
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        color: Colors.primary,
    },
    subTitle: {
        fontSize: 18,
    },
    name: {
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.primary
    },
    class: {
        fontSize: 15,
    },
    img: {
        width: "100%",
        resizeMode: "contain",
        flex: 1,
    },
});
