import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors} from "../../helpers/Colors";

const RoundButton = (props) =>{
    return (
        <TouchableOpacity disabled={props.loading || props.disabled} style={{...styles.buttonStyle,...props.style, backgroundColor: props.primaryColor || Colors.green, borderColor: props.secondaryColor || Colors.green}} onPress={() => props.onPress()}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>{props.loading? <ActivityIndicator size="small" color={props.color} /> : props.component}</View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },

    buttonStyle: {
        padding: 10,
        borderWidth: 2,
        borderStyle: 'solid',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        height: 50,
        borderRadius: 30,
        width: 50,
        elevation: 3,
    }
});

export default RoundButton;
