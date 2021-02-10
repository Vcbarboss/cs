import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View} from 'react-native';

import {Colors} from '../helpers/Colors';
import ButtonStyle1 from "../components/Buttons/ButtonStyle1";
import PropTypes from "prop-types";

export function EmptyComponent(props) {
    return (
        <View style={{backgroundColor: Colors.white, flex: 1, height: '100%', justifyContent: 'space-evenly'}}>
            <View style={{alignItems: 'center', maxHeight: 250, flex: 1}}>
                <Image source={props.image} style={styles.logoNotFound}/>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 22,  marginBottom: 10,  maxWidth: '90%', color: props.primaryColor || Colors.dark, fontWeight: 'bold', textAlign: 'center'}}> {props.title}</Text>
                <Text style={{fontSize: 16, color: Colors.grey, marginBottom: 20, maxWidth: '90%',  textAlign: 'center'}}> {props.subTitle}</Text>
                {props.text &&<Text style={{fontSize: 16, color: Colors.grey, marginBottom: 20, maxWidth: '90%',  textAlign: 'center'}}> {props.text}</Text>}
            </View>
            {props.buttonText &&<View style={{alignItems: 'center'}}>
                <ButtonStyle1 primaryColor={props.primaryColor || Colors.secondary} style={{width: '80%', marginBottom: 15}} secondaryColor={props.primaryColor || Colors.secondary} text={props.buttonText} onPress={() => props.onPress()} borderRadius={30}/>
                {props.secondButtonText &&<ButtonStyle1 primaryColor={props.secondaryColor || Colors.secondary} style={{width: '80%'}} secondaryColor={props.secondaryColor || Colors.secondary} text={props.secondButtonText} onPress={() => props.secondOnPress()} borderRadius={30}/>}
            </View>
            }
        </View>

    );
};

EmptyComponent.propTypes = {
    buttonText: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    onPress: PropTypes.func,
    image: PropTypes.any,
    text: PropTypes.string,
    primaryColor: PropTypes.string,
    secondButtonText: PropTypes.string,
    secondOnPress: PropTypes.any,
    secondaryColor: PropTypes.string
};


const styles = StyleSheet.create({

    logoNotFound: {
        resizeMode: 'contain',
        maxWidth: '100%',
        maxHeight: 250,
        flex: 1
    },
});
