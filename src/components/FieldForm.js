import React, {useRef, useState} from 'react';
import {ActivityIndicator, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import PropTypes from "prop-types";
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from "../helpers/Colors";
import {Texts} from "../helpers/Texts";

export default function FieldForm(props) {


    const inputRef = useRef();
    const [selected, setSelected] = useState(false)

    const handleChange = (e) => {
        props.change(e);
    };

    return (
        <TouchableWithoutFeedback
            onBlur={() => setSelected(false)}
            onFocus={() => setSelected(true)}
            onPress={() => {
            inputRef.current.focus()
        }}>
            <View style={[]}>

                <Text style={{left: props.icon? 2: 2, fontSize: 17, color: props.color || '#040816'}}>{props.label&& props.label}</Text>

                <View style={[styles.inputContainer,{flexDirection: 'row', borderColor: selected ? Colors.blue : "#d9dade",}]}>
                    {props.icon&& <Icon style={styles.icon} name={props.icon} size={24} color={props.color || Colors.primary}/>}
                    <TextInput

                        placeholder={props.placeholder}
                        style={[styles.input, {color: props.disabled? Colors.grey : Colors.grey, paddingBottom: Platform.OS === 'ios' ? 0 : 0 }]}
                        keyboardType={props.keyboardType}
                        secureTextEntry={props.secureTextEntry}
                        value={props.value}
                        ref={(ref) => inputRef.current = ref}
                        editable={!props.disabled}
                        autoFocus={props.autoFocus}
                        onChangeText={(e) => {
                            !props.disabled&& handleChange(e);
                        }}
                        multiline={!!props.multiline}
                        numberOfLines={!!props.multiline? (Platform.OS === 'ios' ? null : props.multiline) : null}
                        minHeight={!!props.multiline? ((Platform.OS === 'ios') ? (35 * props.multiline) : null) : null}
                        maxHeight={!!props.multiline? ((Platform.OS === 'ios') ? (35 * props.multiline) : null) : null}
                    />
                    {props.loading? <ActivityIndicator style={styles.rightIcon} color={Colors.secondary} size={'small'}/>
                        :
                        (props.rightIcon&&<Icon style={styles.rightIcon} name={props.rightIcon} size={24} color={props.color || Colors.primary}/>)}
                    {props.anyComponent}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

FieldForm.propTypes = {
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    value: PropTypes.string,
    change: PropTypes.func,
    mask: PropTypes.string,
    icon: PropTypes.string,
    rightIcon: PropTypes.string,
    color: PropTypes.string,
    label: PropTypes.string,
    loading: PropTypes.bool,
    autoFocus: PropTypes.bool,
    multiline: PropTypes.any,
    anyComponent: PropTypes.any
};

const styles = StyleSheet.create({
        input: {
            flex: 1,
            backgroundColor: 'transparent',
            fontSize: 17,
            paddingBottom: 5,
            color: Colors.grey
        },
        inputContainer: {
            backgroundColor: "white",
            borderWidth: 1,

            borderRadius: 10,
            padding: 10,
            marginVertical: 5,
        },
        icon: {
            marginRight: 6
        },
        rightIcon: {

        },
    },
);
