import React, {useState, useRef} from "react";
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView, Modal, Animated, Keyboard,
} from "react-native";
import {Colors} from "../../../helpers/Colors";
import Toast from "../../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../../components/Loading";
import {Texts} from "../../../helpers/Texts";
import Icon from "react-native-vector-icons/Ionicons";
import FilterNotification from "../../../components/FilterNotification";
import GeneralStatusBarColor from "../../../components/StatusBarColor";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const screenHeight = Math.round(Dimensions.get("window").height);

const list = [
    {label: "Preenchidos", value: "filled"},
    {label: "Não preenchidos", value: "blank"},
    {label: "Todos", value: "all"},
];

const filterList = [
    {label: 'Preenchidos', value: 'filled'},
    {label: 'Não preenchidos', value: 'blank'},
    {label: 'Todos', value: 'all'},
];

export function FormListScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const [filter, setFilter] = useState({label: "Todos", value: "all"});
    let filterAux = useRef({label: 'Todos', value: 'ALL'}).current;
    const [isFilter, setIsFilter] = useState(false);
    const altFilter = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState();

    const getData = async () => {

        setLoading(true);
        try {
            const res = await api.get(`app/enrollment/${props.item.enrollment_id}/form/list/${filter.value}`);

            setData(res.object);
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

    let openAlt = altFilter.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '20%']
    })

    const onFilter = () => {
        Keyboard.dismiss()
        if (!isFilter) {
            openFilter()
        } else {
            closeFilter()
        }

    }

    const openFilter = () => {
        setIsFilter(true)
        altFilter.setValue(0)
        Animated.spring(altFilter, {
            toValue: 100,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    const closeFilter = () => {
        setIsFilter(false)
        Animated.spring(altFilter, {
            toValue: 0,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    useFocusEffect(
        React.useCallback(() => {
            getData();
        }, [filter]),
    );

    return (
        <>

            <View style={styles.container}>
                <Toast ref={refNotification}/>
                <GeneralStatusBarColor backgroundColor={Colors.statusBar}
                                       barStyle="light-content"/>
                {/*<StatusBar*/}
                {/*  backgroundColor={Colors.primary}*/}
                {/*  barStyle="light-content"*/}
                {/*/>*/}
                <View style={{backgroundColor: Colors.opt1}}>

                </View>
                <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 10,}}>
                    <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                        <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
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
                        }}>Fichas</Text>

                    </View>
                    <TouchableOpacity style={{alignItems: "center", justifyContent: 'center'}}
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
                    {isFilter &&
                    <>

                        <View style={{
                            padding: 20,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: Texts.title,
                                    color: Colors.primary,
                                    marginBottom: 5
                                }}>Filtrar
                                por:</Text>
                            <View style={{
                                flexDirection: 'row',
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}>
                                {filterList.map((item, index) =>
                                    <TouchableOpacity
                                        style={[styles.filter, {backgroundColor: filter.value === item.value ? Colors.primary : 'white'}]}
                                        key={index}
                                        onPress={() => {
                                            onFilter()
                                            setFilter(item)
                                            filterAux = item
                                            getData()
                                        }}>
                                        {filter.value === item.value &&
                                        <MaterialCommunityIcons name={'check'} style={{marginRight: 5}}
                                                                size={20} color={'white'}/>
                                        }
                                        <Text
                                            style={{color: filter.value === item.value ? 'white' : Colors.primary}}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </>
                    }
                </Animated.View>
                {loading ? (
                        <Loading/>

                    )
                    :
                    (
                        <>
                            {data?.length > 0 ?
                                <ScrollView style={{backgroundColor: "white", elevation: 5}}>
                                    {data?.map((item, index) =>
                                        <TouchableOpacity key={index} style={[styles.item, {
                                            backgroundColor: item.filled ? Colors.selected : "white",
                                            borderColor: item.filled ? Colors.selectedBorder : "gainsboro",
                                        }]} onPress={() => navigation.navigate("FormScreen", {
                                            item: item,
                                            enrollment: props.item.enrollment_id,
                                        })}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <Text style={styles.subtitle}>{item.description}</Text>
                                        </TouchableOpacity>,
                                    )}

                                </ScrollView>
                                :
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    padding: 10
                                }}>
                                    {/*<Image source={logo} style={styles.logo} />*/}
                                    <Text style={{fontSize: Texts.title, textAlign: 'center'}}>
                                        {props.item.student.person.name.split(" ")[0]} ainda não possui nenhum
                                        formulário
                                    </Text>
                                </View>
                            }
                        </>
                    )}
            </View>

        </>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        display: "flex",
        backgroundColor: 'white',
    },
    title: {
        fontSize: Texts.listTitle,
        fontWeight: "bold",
        marginVertical: 5,
        color: Colors.primary,
    },
    subtitle: {
        fontSize: Texts.listDescription,
        marginTop: 5,
        color: Colors.primary
    },
    item: {
        padding: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#d9dade",
        backgroundColor: "#fcfcfc",
    },
    centeredView: {
        flex: 1,
        backgroundColor: "rgba(60, 60, 60, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
});
