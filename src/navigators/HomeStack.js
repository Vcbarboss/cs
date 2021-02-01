import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import ToastNotification from '../components/ToastNotification';
import {KeyboardAvoidingView, Platform, Dimensions} from 'react-native';
import ErrorBoundary from '../components/ErrorBoundary';
import { HomeScreen } from "../screens/HomeScreen";
import { StudentListScreen } from "../screens/Student/StudentListScreen";
import { StudentScreen } from "../screens/Student/StudentScreen";
import { NotificationList } from "../screens/Notification/NotificationList";
import { NotificationScreen } from "../screens/Notification/NotificationScreen";
import { ProfileScreen } from "../screens/Profile/ProfileScreen";
import { ChangePasswordScreen } from "../screens/Profile/ChangePasswordScreen";
import { EditScreen } from "../screens/Profile/EditScreen";
import { StudentStackNavigator } from "./StudentStack";

const HomeStack = createStackNavigator();

export function HomeStackNavigator({navigation}) {
  const refNotification = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
  }, []);

  return (
    <ErrorBoundary screenType={'initialStack'}>
      <KeyboardAvoidingView
        behavior={"padding"}
        enabled={Platform.OS === "ios"}
        style={{flex: 1}}
      >
        <ToastNotification ref={refNotification} navigation={(e) => navigation.navigate(e)} />
        <HomeStack.Navigator initialRouteName={'HomeScreen'}>

          <HomeStack.Screen name={'HomeScreen'} component={HomeScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'StudentList'} component={StudentListScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'StudentStack'} component={StudentStackNavigator} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'NotificationList'} component={NotificationList} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'NotificationScreen'} component={NotificationScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'ProfileScreen'} component={ProfileScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'ChangePasswordScreen'} component={ChangePasswordScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'EditScreen'} component={EditScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>

        </HomeStack.Navigator>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}
