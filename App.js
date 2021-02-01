import React,{useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {InitialStackNavigator} from './src/navigators/InitialStack';
import store from './src/Store';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import useAuth from "./src/hooks/Auth";

const RootStack = createStackNavigator();


export default function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();




  return (

    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          routeNameRef.current = currentRouteName;
        }}
      >
        <RootStack.Navigator>
          <RootStack.Screen name={'MainStack'} options={{headerShown: false}}>
            {() => (
              <InitialStackNavigator/>
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
