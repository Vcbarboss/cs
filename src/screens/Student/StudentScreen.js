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
    SafeAreaView, Image, Platform, Animated, RefreshControl
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

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 142 : 155;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export function StudentScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const api = useApi({navigation});
    const refNotification = useRef();
    const user = useSelector((state) => state).userReducer;
    const props = route.params;
    const [isVisible, setIsVisible] = useState(false)

    const [scrollY, setScrollY] = useState(new Animated.Value(
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
    ))
    const [refreshing, setRefreshing] = useState(false)


    const _renderScrollViewContent = () => {
        const data = Array.from({length: 30});
        return (
            <View style={styles.scrollViewContent}>
                {data.map((_, i) => (
                    <View key={i} style={styles.row}>
                        <Text>{i}</Text>
                    </View>
                ))}
            </View>
        );
    }

    const scroll = Animated.add(
        scrollY,
        Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerTranslate = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });

    const imageOpacity = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });
    const imageTranslate = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    const titleScale = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 1],
        extrapolate: 'clamp',
    });
    const titleTranslate = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, 0],
        extrapolate: 'clamp',
    });

    const avatarScale = scroll.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0.6],
        extrapolate: 'clamp',
    });

    const avatarTranslateY = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 6, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, -80],
        extrapolate: 'clamp',
    });
    const avatarTranslateX = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 6, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, 50],
        extrapolate: 'clamp',
    });

    const infoTranslate = scroll.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 6, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, -90],
        extrapolate: 'clamp',
    })

    const infoOpacity = scroll.interpolate({
        inputRange: [1, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
    });


    return (
        <View style={styles.fill}>
            <StatusBar
                translucent
                barStyle="light-content"
                backgroundColor="rgba(0, 0, 0, 0.251)"
            />

            <Animated.ScrollView
                style={[styles.fill, {margin: 10, marginBottom: 0, backgroundColor: Colors.primary, marginTop: 20}]}
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center',}}
                scrollEventThrottle={1}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: true},
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            setTimeout(() => setRefreshing(false), 1000);
                        }}
                        // Android offset for RefreshControl
                        progressViewOffset={HEADER_MAX_HEIGHT}
                    />
                }
                // iOS offset for RefreshControl
                contentInset={{
                    top: HEADER_MAX_HEIGHT,
                }}
                contentOffset={{
                    y: -HEADER_MAX_HEIGHT,
                }}
            >
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT - 10 : 0,

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
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
                    </View>


                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: 'white',
                }}>
                    <TouchableOpacity style={[styles.itemList, {borderColor: '#8a67b7'}]}
                                      onPress={() => navigation.navigate('FormListScreen',
                                          {item: props?.item},
                                      )}>
                        <AntIcon name={'form'} color={'#8a67b7'} size={40}/>
                        <Text style={{textAlign: 'center'}}> FICHAS </Text>
                    </TouchableOpacity>
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

                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: 'white',
                }}>
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
                    justifyContent: "space-between",
                    backgroundColor: 'white',
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

                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: 'white',
                }}>
                    <TouchableOpacity style={[styles.itemList, {borderColor: '#02BEF1'}]}
                                      onPress={() =>
                                          navigation.navigate('AttendanceListScreen',
                                              {item: props?.item},
                                          )
                                      }>
                        <MCIcon name={'account-check-outline'} color={'#02BEF1'} size={40}/>
                        <Text style={{textAlign: 'center'}}> FREQUÊNCIA </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.itemList2, {borderColor: '#14213d'}]}
                                      onPress={() =>
                                          navigation.navigate('KnowledgeScreen',
                                              {item: props?.item},
                                          )
                                      }>
                        <Icon name={'ios-book-outline'} color={'#14213d'} size={40}/>
                        <Text style={{textAlign: 'center'}}> CONTEÚDOS </Text>
                    </TouchableOpacity>

                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: 'white',
                }}>
                    <TouchableOpacity style={[styles.itemList, {borderColor: '#e63946'}]}
                                      onPress={() =>
                                          navigation.navigate('OccurrenceScreen',
                                              {item: props?.item},
                                          )
                                      }>
                        <Icon name={'warning-outline'} color={'#e63946'} size={40}/>
                        <Text style={{textAlign: 'center'}}> OCORRÊNCIAS </Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={[styles.itemList, {borderColor: '#e63946'}]}*/}
                    {/*                  onPress={() =>*/}
                    {/*                      navigation.navigate('AnimationScreen',*/}
                    {/*                          {item: props?.item},*/}
                    {/*                      )*/}
                    {/*                  }>*/}
                    {/*    <MCIcon name={'account-check-outline'} color={'#e63946'} size={40}/>*/}
                    {/*    <Text style={{textAlign: 'center'}}> Animacao </Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </Animated.ScrollView>
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.header,
                    {transform: [{translateY: headerTranslate}]},
                ]}
            >
                {/*<Animated.Image*/}
                {/*    style={[*/}
                {/*        styles.backgroundImage,*/}
                {/*        {*/}
                {/*            opacity: imageOpacity,*/}
                {/*            transform: [{translateY: imageTranslate}],*/}
                {/*        },*/}
                {/*    ]}*/}
                {/*    source={{uri: 'https://1.bp.blogspot.com/-AVkl0Zdo0DI/X5tcP4uombI/AAAAAAAAEeE/JdxES_6EpjcbBAKwYG--Gk3-AF36YFNmQCLcBGAsYHQ/w1200-h630-p-k-no-nu/jujutsu-kaisen-sukuna-sorrindo.jpg'}}*/}
                {/*/>*/}
                <Animated.View style={[styles.card, {
                    height: HEADER_MAX_HEIGHT / 1.5,
                    opacity: imageOpacity,
                    transform: [{translateY: imageTranslate}],
                }]}>
                    <View
                        style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Colors.lightgray}}>
                        <View style={{flex: 0.7, justifyContent: "center", padding: 17,}}>
                            <Text style={{
                                color: Colors.grey,
                                fontWeight: 'bold'
                            }}>{props?.item.student.person.name.toUpperCase()}</Text>
                            <Text
                                style={styles.class}>{moment().diff(props?.item.student.person.natural_birthday, "years") + " anos"}</Text>
                            <Text style={[styles.class, {}]}>{props?.item.class_room.description}</Text>
                        </View>
                    </View>
                    <View style={{padding: 5}}>
                        <Text
                            style={{textAlign: 'center'}}>{user.object.person.contact_mobile_phone ? maskViewPhone(user.object.person.contact_mobile_phone) : '-'}</Text>
                        <Text
                            style={{textAlign: 'center'}}>{props?.item.student.person.address_street} - {props?.item.student.person.address_district}</Text>
                    </View>
                </Animated.View>


            </Animated.View>
            <Animated.View
                style={[
                    styles.bar,
                    {
                        borderBottomWidth: 1,
                        borderColor: '#8b98ae',
                        marginVertical: 10,
                        transform: [
                            {scale: titleScale},
                            {translateY: titleTranslate},
                        ],
                    },
                ]}
            >
                <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                    <AntIcon name={"arrowleft"} style={{marginLeft: 10, marginTop: 10,}} size={25} color={"white"}/>
                </TouchableOpacity>
                <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                    <Text style={{color: "white", fontSize: Texts.title, textAlign: 'center', fontWeight: '700'}}>CONSTRUINDO
                        O SABER</Text>
                    <Text style={{color: "#8b98ae", fontSize: Texts.subtitle, textAlign: 'center'}}>Área
                        do aluno </Text>

                </View>
                <Animated.View style={[styles.info,
                    {
                        position: 'absolute',
                        top: 65,
                        left: 10,
                        flex: 1,
                        maxWidth: screenWidth * 0.8,
                        flexDirection: 'row',
                        opacity: infoOpacity,
                        // transform: [
                        //     {translateY: infoTranslate,},
                        // ],
                    }]}>
                    <View style={{}}>
                        <Text style={[{
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: 18
                        }]}>{props?.item.student.person.name.toUpperCase()} </Text>
                        <Text style={[{
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center'
                        }]}>{props?.item.class_room.description}</Text>
                    </View>

                </Animated.View>
                {props?.item.student.person.avatar ?
                    <Animated.View style={[styles.avatar,
                        {
                            position: 'absolute',
                            right: 20,
                            top: 85,

                            transform: [
                                {scale: avatarScale,},
                                {translateY: avatarTranslateY,},
                                {translateX: avatarTranslateX},
                            ],
                        }]}>
                        <Avatar.Image style={{}} size={screenWidth * 0.22}
                                      source={{uri: props?.item.student.person.avatar}}/>
                    </Animated.View>
                    :
                    <View style={{flex: 0.5}}>
                    </View>
                }
            </Animated.View>
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
    );

}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.primary,
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 28 : 28,
        height: 50,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        marginTop: 100,
        margin: 10,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 35,
        borderTopColor: Colors.tertiary,
        borderBottomColor: Colors.tertiary,
        borderTopWidth: 35,
        borderBottomWidth: 5,
    },
    avatar: {
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: 'white',
        borderRadius: 55,
        padding: 3,
    },
    info: {
        alignItems: 'center'
    },
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
});
