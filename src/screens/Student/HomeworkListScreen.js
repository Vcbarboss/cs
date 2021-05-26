import React, {useState, useRef, useEffect} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Dimensions,
    Text, Image,
    Animated
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../components/Loading";
import {Texts} from "../../helpers/Texts";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import moment from "moment";
import FieldSearch from "../../components/FieldSearch";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Svg, {Defs, LinearGradient, Path, Stop,} from 'react-native-svg';
import AnimatedHeader from "../../components/AnimatedHeader";
import Modal from 'react-native-modal';
import {Picker} from "@react-native-picker/picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const scrollPos = Dimensions.get('window').height / 4;

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get('window').width);
const height = (32 * screenWidth) / 64;

const color = ['white', '#36B37E', '#FFC400', '#FF5630']

export function HomeworkListScreen({route, navigation}) {
    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false)
    const [filter, setFilter] = useState(false)
    const [scrollY, setScrollY] = useState(new Animated.Value(0))
    const [isVisible, setIsVisible] = useState(false);
    const [search, setSearch] = useState()
    const props = route.params;
    const api = useApi({navigation});
    const refNotification = useRef();
    const data = useRef([])
    const dataShow = useRef([])
    let isFilter = useRef().current
    const altFilter = useRef(new Animated.Value(0)).current;
    const [status, setStatus] = useState({
            key: 'ALL',
            value: 'Todas'
        },
    )
    let statusAux = useRef({
        key: 'ALL',
        value: 'Todas'
    },).current
    const statusList = useRef([
        {
            key: 'ACCOMPLISHED',
            value: 'Realizadas'
        },
        {
            key: 'NOT_ACCOMPLISHED',
            value: 'Não realizadas'
        },
        {
            key: 'OPEN',
            value: 'Em aberto'
        },
        {
            key: 'PARTIAL',
            value: 'Parcial'
        },
        {
            key: 'ALL',
            value: 'Todas'
        },
    ]).current

    const getData = async (filter) => {
        setFilterLoading(true)
        if (!isFilter) {
            setLoading(true);
        }

        try {
            console.log(`app/homework/paginate?page=${1}&limit=10&enrollment_id=${props.item.enrollment_id}&order_field=homework_created_at&order_type=DESC&search_list=${statusAux.key}&search_global=${filter ? filter : ''}`)
            const res = await api.get(`app/homework/paginate?page=${1}&limit=10&enrollment_id=${props.item.enrollment_id}&order_field=homework_created_at&order_type=DESC&search_list=${statusAux.key}&search_global=${filter ? filter : ''}`);
            data.current = res.object.data;

            for (let i = 0; i < data.current.length; i++) {
                if (data.current[i].correction_finish_status === 'ACCOMPLISHED') {
                    data.current[i].status = 1;
                } else if (data.current[i].correction_finish_status === "PARTIAL") {
                    data.current[i].status = 2
                } else if (data.current[i].correction_finish_status === "NOT_ACCOMPLISHED") {
                    data.current[i].status = 3
                } else {
                    data.current[i].status = 0
                }
            }
            dataShow.current = data.current
            if (!isFilter) {
                setLoading(false);
            }
            setFilterLoading(false)


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

    const onChange = (value) => {
        setSearch(value)
        isFilter = true;

        getData(value)
        isFilter = false;
    }

    let openAlt = altFilter.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '25%']
    })

    // let closeAlt = altFilter.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: ['0%', '25%']
    // })

    const onFilter = () => {

        if (!filter) {
            openFilter()
        } else {
            closeFilter()
        }

    }

    const openFilter = () => {
        setFilter(true)
        altFilter.setValue(0)
        Animated.spring(altFilter, {
            toValue: 100,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    const closeFilter = () => {
        setFilter(false)
        Animated.spring(altFilter, {
            toValue: 0,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    useEffect(() => {
        getData()
    }, []);

    return (

        <>
            <View style={styles.container}>

                <Toast ref={refNotification}/>
                <GeneralStatusBarColor backgroundColor={Colors.primary}
                                       barStyle="light-content"/>
                {/*<StatusBar*/}
                {/*  backgroundColor={Colors.primary}*/}
                {/*  barStyle="light-content"*/}
                {/*/>*/}
                <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                    <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                        <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                    </TouchableOpacity>
                    <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10}}>
                        <Text style={{color: "white", fontSize: Texts.title,}}>Construindo o Saber</Text>
                        <Text style={{color: "white", fontSize: Texts.subtitle,}}>Tarefas</Text>
                    </View>
                    <TouchableOpacity style={{marginTop: 10, alignItems: "flex-end"}}
                                      onPress={() => onFilter()}>
                        <SimpleLineIcons name={'equalizer'} style={{}} size={25} color={'white'}/>
                    </TouchableOpacity>
                </View>
                <Animated.View
                    style={{
                        width: '100%',
                        height: openAlt,
                        backgroundColor: 'white',
                    }}
                >
                    {filter &&
                    <>

                        <View style={{
                            padding: 20,
                        }}>
                            <Text style={{fontWeight: 'bold', fontSize: Texts.title, color: Colors.primary}}>Filtrar
                                por:</Text>
                            <View style={{
                                flexDirection: 'row',
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}>
                                {statusList.map((item, index) =>
                                    <TouchableOpacity
                                        style={[styles.filter, {backgroundColor: status.key === item.key ? Colors.primary : 'white'}]}
                                        key={index}
                                        onPress={() => {
                                            setStatus(item)
                                            statusAux = item
                                            onFilter()
                                            getData()
                                        }}>
                                        {status.key === item.key &&
                                        <MaterialCommunityIcons name={'check'} style={{marginRight: 5}}
                                                                size={20} color={'white'}/>
                                        }
                                        <Text
                                            style={{color: status.key === item.key ? 'white' : Colors.primary}}>{item.value}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </>
                    }
                </Animated.View>


                <FieldSearch
                    placeholder="Busca"
                    value={search}
                    change={(e) => onChange(e)}
                    icon={"search"}
                />
                {loading ? (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Loading/>
                        </View>


                    )
                    :
                    (
                        <ScrollView
                            onScroll={Animated.event([
                                {nativeEvent: {contentOffset: {y: scrollY}}},
                            ], {useNativeDriver: false})}
                            scrollEventThrottle={16}
                        >

                            <>
                                {
                                    dataShow.current.map((item, index) =>
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.card, {
                                                borderLeftWidth: 5,
                                                borderColor: color[item.status],
                                            }]}
                                            onPress={() => navigation.navigate('HomeworkDatailsScreen', {
                                                data: item,
                                                color: color[item.status],

                                            })}>


                                            <View style={{
                                                padding: 10,
                                                backgroundColor: '#cacaca40',
                                                borderRadius: 5,
                                                width: 60,
                                            }}>

                                                <Text style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: 'black'
                                                }}>{moment(item.homework_due_date).format('DD')}</Text>
                                                <Text style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: 'black'
                                                }}>{moment(item.homework_due_date).format('MMM').toUpperCase()}</Text>

                                            </View>
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                marginHorizontal: 10
                                            }}>
                                                <Text style={{
                                                    fontSize: Texts.listTitle,
                                                    color: Colors.primary.toUpperCase(),
                                                    fontWeight: 'bold'
                                                }}>{item.school_subject_description}</Text>
                                                <Text style={{
                                                    fontSize: Texts.listDescription,
                                                    color: Colors.primary
                                                }}>
                                                    {item.homework_description.slice(0, 40)}
                                                    {item.homework_description.length > 40 &&
                                                    <Text>...</Text>
                                                    }

                                                </Text>
                                                <View style={{justifyContent: 'flex-end',}}>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            </>

                        </ScrollView>
                    )}
            </View>
            <Modal
                // animationType="slide"
                style={{backgroundColor: Colors.primary,}}
                animationIn={'slideInDown'}
                backdropOpacity={0}
                animationInTiming={500}
                animationOutTiming={500}
                animationOut={'slideOutUp'}
                backdropTransitionOutTiming={0}
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
            >
                <TouchableOpacity style={styles.headerContainer} onPress={() => setIsVisible(false)}>
                    <Text style={styles.welcome}>Filtro</Text>
                    <Text style={styles.welcome}>Filtro</Text>
                    <Text style={styles.welcome}>Filtro</Text>
                    <Text style={styles.welcome}>Filtro</Text>
                </TouchableOpacity>


            </Modal>
        </>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        // backgroundColor: 'white',
    },
    filter: {
        height: 43,
        margin: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    card: {
        flexDirection: 'row',
        height: 80,
        padding: 10,
        elevation: 2,
        backgroundColor: 'white',
        marginHorizontal: 5,
        marginVertical: 5,
        borderColor: "#d9dade",
        borderRadius: 6,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    header: {
        position: 'absolute',
    },
    headerContainer: {
        justifyContent: 'space-between',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary
    },
    welcome: {
        fontSize: 34,
        textAlign: 'left',
        fontWeight: '700',
        color: '#ffffff'
    },
});
