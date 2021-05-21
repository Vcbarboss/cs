import React, {useState, useRef, useEffect} from "react";
import {
    Modal,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Text,
} from "react-native";
import {Colors} from "../../helpers/Colors";
import Toast from "../../components/Toast";
import {useFocusEffect} from "@react-navigation/native";
import useApi from "../../hooks/Api";
import AntIcon from "react-native-vector-icons/AntDesign";
import Loading from "../../components/Loading";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import {Texts} from "../../helpers/Texts";
import GeneralStatusBarColor from "../../components/StatusBarColor";
import {Picker} from '@react-native-picker/picker';


const screenHeight = Math.round(Dimensions.get("window").height);

export function HomeworkListScreen({route, navigation}) {
    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const props = route.params;
    const data = useRef()
    const [isVisible, setIsVisible] = useState(false);
    const sections = useRef([])
    const [currentData, setCurrentData] = useState()
    const [selected, setSelected] = useState("Bimestre 1");

    const getData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`app/student-grade/${props.item.enrollment_id}/list`);
            sections.current = []
            data.current = res.object;
            console.log(res)
            for (let i = 0; i < res.object.length; i++) {
                sections.current.push(res.object[i].stage_description)
            }
            onChange(0)
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

    const onChange = (value) => {
        setCurrentData(data.current[value])

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
                            {/*<TouchableOpacity style={{marginTop: 10, alignItems: "flex-end"}}*/}
                            {/*                  onPress={() => console.log(currentData)}>*/}
                            {/*    <Text>Print</Text>*/}
                            {/*</TouchableOpacity>*/}
                        </View>


                        <ScrollView>
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('ReportDetailsScreen', {})}>
                                <View style={{padding: 20, flex: 1}}>
                                    <Text style={{fontSize: Texts.subtitle, fontWeight: 'bold'}}>
                                        Decorar tabuadas do 0 ao 5
                                    </Text>
                                    <View style={{justifyContent: 'flex-end',}}>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 0.3,
                                    // backgroundColor: '#1c2838',
                                    borderTopRightRadius: 15,
                                    borderBottomRightRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: 'green'}}>
                                        Concluída
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                )}
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
});
