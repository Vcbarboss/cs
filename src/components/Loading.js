import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Colors} from "../helpers/Colors";

export default function Loading() {

  return (
    <View style={{flex: 1,  zIndex: 12340, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
