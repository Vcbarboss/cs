import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import ToastNotification from '../components/ToastNotification';
import ErrorBoundary from '../components/ErrorBoundary';
import { HomeScreen } from "../screens/HomeScreen";
import { NotificationList } from "../screens/Notification/NotificationList";
import { ProfileScreen } from "../screens/Profile/ProfileScreen";
import { ChangePasswordScreen } from "../screens/Profile/ChangePasswordScreen";
import { EditScreen } from "../screens/Profile/EditScreen";
import { StudentStackNavigator } from "./StudentStack";
import {ChatScreen} from "../screens/chat/ChatScreen";
import {SectorScreen} from "../screens/chat/SectorScreen";
import {SchoolCalendar, SchoolCalendarScreen} from "../screens/InitialStackScreens/SchoolCalendar";

const HomeStack = createStackNavigator();

export function HomeStackNavigator({navigation}) {
  const refNotification = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
  }, []);

  return (
    <ErrorBoundary screenType={'initialStack'}>
        {/*<ToastNotification ref={refNotification} navigation={(e) => navigation.navigate(e)} />*/}
        <HomeStack.Navigator initialRouteName={'HomeScreen'}>

          <HomeStack.Screen name={'HomeScreen'} component={HomeScreen} options={{
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
          <HomeStack.Screen name={'ProfileScreen'} component={ProfileScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'SchoolCalendarScreen'} component={SchoolCalendarScreen} options={{
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
          <HomeStack.Screen name={'ChatScreen'} component={ChatScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>
          <HomeStack.Screen name={'SectorScreen'} component={SectorScreen} options={{
            headerShown: false,
            gesturesEnabled: false,
            animationEnabled: false,
          }}/>

        </HomeStack.Navigator>
    </ErrorBoundary>
  );
}
