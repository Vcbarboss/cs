import React from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {Colors} from "../helpers/Colors";

export default function Conecting() {

  return (
    <View style={{flex: 1,  zIndex: 12340, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
      <Text style={{fontSize: 20, color: Colors.primary}}>Conectando </Text>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
