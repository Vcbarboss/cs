import React, {useState, useCallback, useEffect} from 'react'
import {GiftedChat} from 'react-native-gifted-chat'
import 'dayjs/locale/pt-br'
import Loading from "../../components/Loading";
import {Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import {Texts} from "../../helpers/Texts";

export function ChatScreen({navigation}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Coé',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <>
            {loading ? (
                    <Loading/>

                )
                :
                (
                    <>
                        <View style={{flexDirection: "row", backgroundColor: Colors.primary, padding: 20}}>
                            <TouchableOpacity style={{}} onPress={() => navigation.pop()}>
                                <AntIcon name={"arrowleft"} style={{marginTop: 10,}} size={25} color={"white"}/>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: "center", paddingLeft: 10}}>

                                <Text style={{color: "white", fontSize: 23,}}>Construindo o Saber</Text>
                                <Text style={{color: "white", fontSize: Texts.subtitle,}}>Perfil </Text>
                            </View>
                            <TouchableOpacity style={{alignItems: "flex-end", justifyContent: "center"}}
                                              onPress={() => navigation.navigate("EditScreen")}>
                                <AntIcon style={{marginRight: 10}} name={"edit"} size={30} color={"white"}/>
                            </TouchableOpacity>
                        </View>
                        <GiftedChat
                            locale={'pt-br'}
                            placeholder={'Digite sua menssagem...'}
                            messages={messages}
                            onSend={messages => onSend(messages)}
                            user={{
                                _id: 1,
                            }}
                        />
                    </>
                )
            }
        </>
    )
}
