import React from 'react';
import {View} from 'react-native';
import PropTypes from "prop-types";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Ribbon(props) {

    return (
        <View style={{position: 'absolute', right: 5, top: -5}}>
            <View style={{flexDirection: 'row',}}>
                <View
                    style={{
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderRightWidth: 5,
                        borderTopWidth: 5,
                        borderRightColor: 'transparent',
                        borderTopColor: props.color1,
                        transform: [{rotate: '180deg'}],
                    }}
                />
                <View
                    style={{
                        width: 30,
                        height: 30,
                        padding: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: props.color2,

                        borderTopRightRadius: 3,
                        borderBottomRightRadius: 3,
                    }}>
                    <Ionicons name={props.icon} size={25} color={'white'}/>
                </View>
            </View>


            <View style={{flexDirection: 'row',}}>
                <View
                    style={{
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderRightWidth: 15,
                        borderTopWidth: 15,
                        borderRightColor: 'transparent',
                        borderTopColor: props.color2,
                        marginLeft: 5,
                        marginTop: -1
                    }}
                />
                <View
                    style={{
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderRightWidth: 15,
                        borderTopWidth: 15,
                        borderRightColor: 'transparent',
                        borderTopColor: props.color2,
                        transform: [{rotate: '90deg'}],
                        marginTop: -1
                    }}
                />
            </View>

        </View>
    );
}

Ribbon.propTypes = {
    color1: PropTypes.string,
    color2: PropTypes.string,
    icon: PropTypes.string
};


