import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeStackNavigator } from "./HomeStack";
import { DrawerComponent } from "../components/DrawerComponent";


const Main = createDrawerNavigator();

export function MainStack() {

  return (
    <Main.Navigator drawerContent={props => <DrawerComponent {...props} />}>

      <Main.Screen name={'Home'} component={HomeStackNavigator} options={{
        headerShown: false,
        gesturesEnabled: false,
        animationEnabled: false,
      }}/>

    </Main.Navigator>
  );
}
