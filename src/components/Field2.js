import React, {useRef} from 'react';
import {ActivityIndicator, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import PropTypes from "prop-types";
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from "../helpers/Colors";

export default function Field2(props) {

  const inputRef = useRef();

  const handleChange = (e) => {
    props.change(e);
  };

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
      <View style={[styles.inputContainer]}>
        <Text style={{left: props.icon? 27: 2, fontWeight: 'bold', color: props.color || Colors.primary}}> {props.label&& props.label}</Text>
        {props.icon&& <Icon style={styles.icon} name={props.icon} size={24} color={props.color || Colors.primary}/>}
       <View style={{flexDirection: 'row'}}>
        <TextInput
          placeholder={props.placeholder}
          style={[styles.input, {color: props.disabled? Colors.grey : Colors.dark, paddingBottom: Platform.OS === 'ios' ? 0 : 5 }]}
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

Field2.propTypes = {
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
      fontSize: 18,
      paddingBottom: 5
    },
    inputContainer: {

    },
    icon: {
      marginRight: 6
    },
    rightIcon: {

    },
  },
);
