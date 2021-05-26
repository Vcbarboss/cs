import React, {useState, useRef, useEffect} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
    Text,
    Modal
} from "react-native";
import {Colors} from "../../helpers/Colors";
import {useFocusEffect} from "@react-navigation/native";


export function AnimationScreen({route, navigation}) {

    const larAnimada = useRef(new Animated.Value(0)).current;
    const altAnimada = useRef(new Animated.Value(50)).current;

    const animate = () =>{
        altAnimada.setValue(0)
        Animated.spring(altAnimada, {
            toValue: 100,
            duration: 200,
            friction: 6,
            useNativeDriver: false
        }).start()
    }

    useFocusEffect(
        React.useCallback(() => {

        }, []),
    );

    let percentLar = larAnimada.interpolate({
        inputRange:[0, 100],
        outputRange:['0%', '100%']
    })

    let percentAlt = altAnimada.interpolate({
        inputRange:[0, 100],
        outputRange:['0%', '25%']
    })


    return (

        <View style={styles.container}>
            <Animated.View
                style={{
                    width: percentLar,
                    height: percentAlt,
                    backgroundColor: Colors.tertiary,
                    justifyContent: 'center'
                }}
            >
            </Animated.View>
            <Text>Testando animaçao</Text>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{backgroundColor: Colors.primary, borderRadius: 20, padding: 20}} onPress={() => animate()}>
                    <Text style={{color: 'white'}}>Animar</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: 'white',
        marginTop: 24,
        alignItems: 'center'
    },

});
