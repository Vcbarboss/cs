import React, {useState, useCallback, useEffect, useRef} from "react";
import "dayjs/locale/pt-br";
import Loading from "../../components/Loading";
import {Alert, Text, TouchableOpacity, View, ScrollView, StyleSheet, Dimensions} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import useApi from "../../hooks/Api";
import Toast from "../../components/Toast";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {useDispatch} from "react-redux";
import {Avatar, Divider} from "react-native-paper";
import moment from "moment";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

const color = [
    {
        primary: '#1c6fbf',
        secondary: '#d3f4ff',
    },
    {
        primary: '#009688',
        secondary: '#b9fbf5',
    },
    {
        primary: '#8a1c7c',
        secondary: '#ffc9f0',
    },
    {
        primary: '#fffcd4',
        secondary: '#FFF236',
    }


]

const daysWeek = [
    {
        name: "Domingo",
        acronym: "Dom"
    },
    {
        name: "Segunda",
        acronym: "Seg"
    },
    {
        name: "Terça",
        acronym: "Ter"
    },
    {
        name: "Quarta",
        acronym: "Qua"
    },
    {
        name: "Quinta",
        acronym: "Qui"
    },
    {
        name: "Sexta",
        acronym: "Sex"
    },
    {
        name: "Sábado",
        acronym: "Sab"
    },]

export function ClassScheduleScreen({route, navigation}) {
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(moment().isoWeekday())
    const [selected, setSelected] = useState(moment().isoWeekday())
    const [data, setData] = useState();
    const api = useApi();
    const refNotification = useRef();
    const days = useRef([])
    const props = route.params;


    const getData = async () => {
        setLoading(true);
        console.log(props)
        setSelectedDay(daysWeek[moment().isoWeekday()].acronym)
        try {
            const res = await api.get(`app/class-room-schedule/${props.item.enrollment_id}/list`);
            days.current = res.object;
            console.log(res)
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

    useEffect(() => {
        getData()
    }, []);


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
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>Horários de aulas</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, backgroundColor: 'white'}}>
                            <View style={{flexDirection: 'row', padding: 5}}>
                                {days.current.map((item, index) =>
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.days, {backgroundColor: selectedDay === daysWeek[index].acronym ? Colors.primary : 'white'}]}
                                        onPress={() => {
                                            setSelectedDay(daysWeek[index].acronym)
                                            setSelected(index)
                                        }}>
                                        <Text
                                            style={{color: selectedDay === daysWeek[index].acronym ? 'white' : Colors.primary}}>
                                            {daysWeek[index].acronym}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                            </View>
                            <ScrollView style={{marginTop: 10}}>

                                {days.current[selected]?.map((item, index) =>

                                    <View style={{backgroundColor: 'white', paddingTop: 10}} key={index}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{
                                                height: 10,
                                                width: 20,
                                                backgroundColor: 'orange',
                                                borderTopRightRadius: 10,
                                                borderBottomRightRadius: 10,
                                            }}/>
                                            <Text
                                                style={{
                                                    marginLeft: 15,
                                                    fontWeight: 'bold',
                                                    color: Colors.primary
                                                }}>
                                                {item.time_initial}
                                            </Text>

                                        </View>
                                        <View style={{
                                            borderRadius: 20,
                                            borderWidth: 2,
                                            borderColor: item.school_subject_color,
                                            padding: 15,
                                            margin: 15,
                                            backgroundColor: item.school_subject_color + '20'
                                        }}>

                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                {/*TODO arrumar quando nao vier foto*/}
                                                <Avatar.Image style={{marginRight: 10}} size={60}
                                                              source={{uri: item.teacher_avatar}}/>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: Texts.listTitle,
                                                            color: item.school_subject_color
                                                        }}>{item.school_subject_description} </Text>
                                                    <Text style={{
                                                        fontSize: Texts.listDescription,
                                                        color: Colors.primary
                                                    }}>
                                                        {item.teacher_name}
                                                    </Text>
                                                </View>

                                            </View>

                                        </View>
                                    </View>
                                )
                                }

                                {days.current[selected]?.length < 1  &&
                                <View style={{marginTop: 150, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
                                    {/*<Image source={logo} style={styles.logo} />*/}
                                    <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                                        Não há horários definidos para este dia.
                                    </Text>
                                </View>
                                }
                            </ScrollView>
                        </View>

                    </>
                )
            }
        </>
    );


}


const styles = StyleSheet.create({
    days: {
        flex: 1,
        margin: 3,
        borderRadius: 10,
        height: 60,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
