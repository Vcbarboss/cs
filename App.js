import React,{useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {InitialStackNavigator} from './src/navigators/InitialStack';
import store from './src/Store';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import useAuth from "./src/hooks/Auth";
import * as Sentry from "@sentry/react-native";

const RootStack = createStackNavigator();


export default function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

    Sentry.init({
        dsn: "https://9b576f563c304df7b1799ef0aefee7fa@o520906.ingest.sentry.io/5631872",
        debug: true,
        environment: 'dev',
        autoSessionTracking: true,
        release: 'cs ' + '1.3+chat',
    });


  return (

    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
            if (previousRouteName !== currentRouteName) {

                Sentry.addBreadcrumb({
                    category: "active_screen",
                    message: currentRouteName,
                    level: Sentry.Severity.Info,
                });
            }
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
