import React from 'react';
import {ActivityIndicator, Image, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import PropTypes from "prop-types";
import {Checkbox} from "react-native-paper";
import {Colors} from "../helpers/Colors";

export default function CheckBox(props) {

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: props.checked? '#f1f9fe' : '#f9f9f9', borderWidth: 1, borderColor: 'gainsboro', borderRadius: 10, padding: 10, margin: 10}}>
      <Checkbox color={Colors.primary} status={props.checked? 'checked' : 'unchecked'} onPress={() => props.onChange(!props.checked)}/>
      <Text style={{fontSize: 16, maxWidth: '90%'}}>{props.text} </Text>
    </View>
  );
}

CheckBox.propTypes = {
  checked: PropTypes.bool,
  text: PropTypes.string,
  onChange: PropTypes.func
};


