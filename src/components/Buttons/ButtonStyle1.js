import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from "../../helpers/Colors";
import PropTypes from "prop-types";

const ButtonStyle1 = (props) =>{
  return (
    <TouchableOpacity disabled={props.loading} style={{...styles.buttonStyle,...props.style, borderRadius: props.borderRadius || 5, backgroundColor: props.primaryColor || Colors.green, borderColor: props.secondaryColor || Colors.green}} onPress={() => props.onPress()}>
      <Text style={{...styles.textStyle, fontSize: props.fontSize || 20, color: props.color || 'white'}}>{props.loading?
        <View style={{padding: 3}}>
          <ActivityIndicator size="small" color={props.color || Colors.white}/>
        </View>  : props.text}</Text>
    </TouchableOpacity>
  );
};

ButtonStyle1.propTypes = {
  loading: PropTypes.bool,
  style: PropTypes.object,
  borderRadius: PropTypes.number,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  onPress: PropTypes.func,
  color: PropTypes.string,
  text: PropTypes.string,
  fontSize: PropTypes.any,
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },

  buttonStyle: {
    padding: 8,
    borderWidth: 2,
    borderStyle: 'solid',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  }
});

export default ButtonStyle1;
