import React, {useState, useRef} from 'react';
import {Colors} from "../helpers/Colors";
import {Text, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const CustomBackButton = ((props)  => {
  return ({
    headerShown: true,
    title: "",
    headerStyle: {
      backgroundColor: Colors.white,
    },
    headerLeft: ({ goBack }) => (
      <View style={{flexDirection: `row`, paddingLeft: 10, alignItems: `center`}} >
        <Icon color={Colors.primary} size={35} name={'arrow-back'} onPress={ () => { props.navigation.pop() } }  />
        <Text style={{fontSize: 18, fontWeight: "bold"}}>  {props?.title || "Voltar"}  </Text>
      </View>
    ),
    gesturesEnabled: false,
    animationEnabled: false,
  })
})
