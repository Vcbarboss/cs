import React, {useState, useRef, useEffect} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
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

const scrollPos = Dimensions.get('window').height / 4;

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get('window').width);
const height = (32 * screenWidth) / 64;

const color = ['white', '#36B37E', '#FFC400', '#FF5630']

export function HomeworkListScreen({route, navigation}) {
    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false)
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const data = useRef([])
    const [isVisible, setIsVisible] = useState(true);
    const [search, setSearch] = useState()
    const dataShow = useRef([])
    const isFilter = useRef()
    const [scrollY, setScrollY] = useState(new Animated.Value(0))

    const curve = scrollY.interpolate({
        inputRange: [0, scrollPos],
        outputRange: [
            'M0 0 L64 0 L64 22 C48 32 16 32 0 22 Z',
            'M0 0 L64 0 L64 20 C48 20 16 20 0 20 Z',
        ],
        extrapolate: 'clamp',
    });

    const getData = async (filter) => {
        setFilterLoading(true)
        if (!isFilter.current) {
            // setLoading(true);
        }

        try {
            console.log(`app/homework/paginate?page=${1}&limit=10&enrollment_id=${props.item.enrollment_id}&order_field=homework_created_at&order_type=DESC&search_list=ALL&search_global=${filter ? filter : ''}`)
            const res = await api.get(`app/homework/paginate?page=${1}&limit=10&enrollment_id=${props.item.enrollment_id}&order_field=homework_created_at&order_type=DESC&search_list=ALL&search_global=${filter ? filter : ''}`);
            data.current = res.object.data;
            console.log(res)

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
            if (!isFilter.current) {
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
        console.log(value)
        setSearch(value)
        isFilter.current = true;

        getData(value)
        isFilter.current = false;
    }


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
                    <View style={styles.container}>
                        <Toast ref={refNotification}/>
                        <GeneralStatusBarColor backgroundColor={Colors.primary}
                                               barStyle="light-content"/>
                        {/*<StatusBar*/}
                        {/*  backgroundColor={Colors.primary}*/}
                        {/*  barStyle="light-content"*/}
                        {/*/>*/}
                        <View style={{backgroundColor: Colors.opt1}}>

                        </View>

                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: Texts.title,}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle,}}>Tarefas</Text>

                            </View>
                            <TouchableOpacity style={{marginTop: 10, alignItems: "flex-end"}}
                                              onPress={() => setIsVisible(true)}>
                                <SimpleLineIcons name={'equalizer'} style={{}} size={25} color={'white'}/>
                            </TouchableOpacity>
                        </View>

                        <FieldSearch
                            placeholder="Busca"
                            value={search}
                            change={(e) => onChange(e)}
                            icon={"search"}
                        />
                        <ScrollView
                            onScroll={Animated.event([
                                {nativeEvent: {contentOffset: {y: scrollY}}},
                            ])}
                            scrollEventThrottle={16}
                        >


                            {dataShow.current.map((item, index) =>
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.card, {borderLeftWidth: 5, borderColor: color[item.status],}]}
                                    onPress={() => navigation.navigate('ReportDetailsScreen', {})}>


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
                                    <View style={{flex: 1, justifyContent: 'center', marginHorizontal: 10}}>
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
                                    {/*{item.status !== 0 &&*/}
                                    {/*<View style={{*/}
                                    {/*    flex: 0.3,*/}
                                    {/*    backgroundColor: color[item.status],*/}
                                    {/*    borderRadius: 15,*/}
                                    {/*    justifyContent: 'center',*/}
                                    {/*    alignItems: 'center'*/}
                                    {/*}}>{item.status === 2 ?*/}
                                    {/*    <Image source={incomplete} style={{height: 35, width: 35,}}/>*/}
                                    {/*    :*/}
                                    {/*    <>*/}
                                    {/*        {item.status === 0 ?*/}

                                    {/*            <>*/}
                                    {/*            </>*/}
                                    {/*            :*/}

                                    {/*            <Ionicons name={ico[item.status]} size={35} color={'white'}/>*/}
                                    {/*        }*/}
                                    {/*    </>*/}
                                    {/*}*/}
                                    {/*</View>*/}
                                    {/*}*/}
                                </TouchableOpacity>
                            )}
                        </ScrollView>

                    </View>
                )}
            <Modal
                // animationType="slide"
                animationIn={'slideInDown'}
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
    drop: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        margin: 10,
        borderRadius: 5,
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
