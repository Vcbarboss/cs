import React, {Component, useState} from 'react';
import {
    Animated,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    RefreshControl, TouchableOpacity, Dimensions,
} from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";
import {Colors} from "../../helpers/Colors";
import moment from "moment";
import {maskViewPhone} from "../../helpers/Functions";
import {Avatar} from "react-native-paper";
import {useSelector} from "react-redux";

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 142 : 155;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const screenWidth = Math.round(Dimensions.get("window").width);

export function AnimationScreen({route, navigation}) {
    const props = route.params;
    const user = useSelector((state) => state).userReducer;

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
                style={styles.fill}
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
                {_renderScrollViewContent()}
            </Animated.ScrollView>
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.header,
                    {transform: [{translateY: headerTranslate}]},
                ]}
            >
                <Animated.Image
                    style={[
                        styles.backgroundImage,
                        {
                            opacity: imageOpacity,
                            transform: [{translateY: imageTranslate}],
                        },
                    ]}
                    source={{uri: 'https://1.bp.blogspot.com/-AVkl0Zdo0DI/X5tcP4uombI/AAAAAAAAEeE/JdxES_6EpjcbBAKwYG--Gk3-AF36YFNmQCLcBGAsYHQ/w1200-h630-p-k-no-nu/jujutsu-kaisen-sukuna-sorrindo.jpg'}}
                />
                <Animated.View style={[styles.card, {
                    height: HEADER_MAX_HEIGHT / 1.6,
                    opacity: imageOpacity,
                    transform: [{translateY: imageTranslate}],
                }]}>
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
                        borderColor: 'red',
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
                        opacity: infoOpacity,
                        // transform: [
                        //     {translateY: infoTranslate,},
                        // ],
                    }]}>
                    <Text style={[{fontWeight: 'bold', color: 'white', fontSize: 20}]}>{props?.item.student.person.name.toUpperCase()}</Text>
                    <Text style={[{fontWeight: 'bold', color: 'white'}]}>{props?.item.class_room.description}</Text>
                </Animated.View>
                {props?.item.student.person.avatar ?
                    <Animated.View style={[styles.avatar,
                        {
                            position: 'absolute',
                            right: 20,
                            top: 80,

                            transform: [
                                {scale: avatarScale,},
                                {translateY: avatarTranslateY,},
                                {translateX: avatarTranslateX},
                            ],
                        }]}>
                        <Avatar.Image style={{}} size={screenWidth * 0.25}
                                      source={{uri: props?.item.student.person.avatar}}/>
                    </Animated.View>
                    :
                    <View style={{flex: 0.5}}>
                    </View>
                }
            </Animated.View>
        </View>
    );

}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
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
    }
});
