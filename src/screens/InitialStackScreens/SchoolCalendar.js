import React, {useState, useCallback, useEffect, useRef} from "react";
import "dayjs/locale/pt-br";
import Loading from "../../components/Loading";
import {Alert, Text, TouchableOpacity, View, ScrollView, StyleSheet, Dimensions} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import {Texts} from "../../helpers/Texts";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import Toast from "../../components/Toast";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {useDispatch} from "react-redux";
import Field from "../../components/Field";
import {Calendar, LocaleConfig, CalendarList, Agenda} from 'react-native-calendars';
import {Divider} from "react-native-paper";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

LocaleConfig.locales['br'] = {
    monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ],
    monthNamesShort: [
        "Jan.",
        "Fev.",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul.",
        "Ago",
        "Set.",
        "Out.",
        "Nov.",
        "Dez."
    ],
    dayNames: [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ],
    dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]
};

LocaleConfig.defaultLocale = "br";

const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};

export function SchoolCalendarScreen({navigation}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [items, setItems] = useState({})
    const api = useApi();
    const refNotification = useRef();
    const year = '2021'
    const tst = useRef()
    const atualDay = useRef()
    const [month, setMonth] = useState();
    const [letivo, setLetivo] = useState()
    const [calendarOpen, setCalendarOpen] = useState(false)

    const getData = async () => {
        try {
            const res = await api.get(`app/calendar/${year}/list`);
console.log(res)
            //setItems(res.object.dates)
            loadItems(res.object.dates)
        } catch (e) {
            console.log(e)
            let aux;
            for (let i = 0; i < Object.keys(e.validator).length; i++) {
                aux = e.validator[Object.keys(e.validator)[i]][0];
                break;
            }
            refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

        }
    }

    const loadItems = (date) => {
        const objArray = Object.entries(date)
        let letivoArray = []
        objArray.map((item, index) => {
            //console.log(item)

            if(item[1].events.length > 0){
                item[1].events[0] = {
                    ...item[1].events[0],
                    school_day: item[1].school_day
                }
            }
            tst.current = {
                ...tst.current,
                [item[0]]: item[1].events
            }
            if(item[1].school_day){
                letivoArray.push(item[0])

            }

        })
        setLetivo(letivoArray)
        setItems(tst.current)
    }

    useFocusEffect(
        React.useCallback(() => {
            Colors.theme = Colors.primary;
            getData()
        }, []),
    );

    const test = (day) => {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!items[strTime]) {

                    items[strTime] = [];
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'item para ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150))
                        });
                    }
                }
            }
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems)
        }, 1000);
    }

    const renderItem = (item) => {
        return (
            <View
                testID={'item'}
                style={[styles.it, {height: item.height,flexDirection: 'row'}]}
            >
                <Text style={{flex: 1}}>{item.description}</Text>
                <View style={{flex: 0.5,alignItems: 'flex-end', justifyContent: 'center'}}>
                    {item.school_day ?
                        <Text style={{color: '#46c38b'}}>Dia letivo</Text>
                        :
                        <Text style={{color: Colors.red}}>Dia não letivo</Text>
                    }
                </View>

            </View>
        );
    }

    function pad(d) {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    const renderEmpty = (e) => {
        let aux
           aux = moment(e[0]).add(1, 'days').format('YYYY-MM-DD')

        const date = aux
        return (
            <View
                testID={'item'}
                 style={[styles.it, {flexDirection: 'row'}]}
            >
                <Text style={{flex: 1}}></Text>
                <View style={{flex: 0.5,alignItems: 'flex-end', justifyContent: 'center'}}>
                    {letivo.includes(date) ?
                        <Text style={{color: '#46c38b'}}>Dia letivo</Text>
                        :
                        <Text style={{color: Colors.red}}>Dia não letivo</Text>
                    }
                </View>

            </View>
        );
    }

    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

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
                                <Text style={{color: "white", fontSize: Texts.subtitle}}>Calendário Escolar</Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            height: "auto",
                            backgroundColor: 'white'
                        }}>
                            {calendarOpen ?

                                <Text style={styles.date}> Calendário </Text>
                                :
                                <Text style={styles.date}> {month} </Text>
                            }
                        </View>
                        <View style={{flex: 1}}>


                            <Agenda
                                items={items}
                                renderItem={renderItem}
                                renderEmptyDate={renderEmpty}
                                loadItemsForMonth={(e) => setMonth(monthNames[e.month - 1] + ' ' + e.year)}
                                onDayChange={(e) => {
                                    setMonth(monthNames[e.month - 1] + ' ' + e.year)
                                    atualDay.current = e.dateString
                                }}
                                onDayPress={(e) => setMonth(monthNames[e.month - 1] + ' ' + e.year)}
                                onCalendarToggled={(calendarOpened) => setCalendarOpen(calendarOpened)}
                                renderKnob={() => {
                                    return (
                                        <TouchableOpacity>
                                            <Icon name="chevron-down" size={20} color="#2079B3"/>
                                        </TouchableOpacity>
                                    );
                                }}

                                theme={{
                                    selectedDayBackgroundColor: '#00adf5',
                                    selectedDayTextColor: '#ffffff',
                                }}

                            />
                        </View>
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
    it: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    date: {
        color: "#2079B3",
        fontSize: 18,
        padding: 10,
        margin: 5,
        borderRadius: 5
    },
});
