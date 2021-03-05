import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ErrorBoundary from '../components/ErrorBoundary';
import {StudentScreen} from "../screens/Student/StudentScreen";
import {AuthPersonListScreen} from "../screens/Student/AuthPersonListScreen";
import {FormScreen} from "../screens/Student/Form/FormScreen";
import {FormListScreen} from "../screens/Student/Form/FormListScreen";
import {StudentNotificationList} from "../screens/Student/StudentNotificationList";
import {FormEditScreen} from "../screens/Student/Form/FormEditScreen";
import {KeyboardAvoidingView, Platform} from "react-native";

const StudentStack = createStackNavigator();

export function StudentStackNavigator({route, navigation}) {
    const refNotification = useRef();
    const props = route.params;

    useEffect(() => {
    }, []);

    return (
        <ErrorBoundary screenType={'initialStack'}>
            <KeyboardAvoidingView
                behavior={"padding"}
                enabled={Platform.OS === "ios"}
                style={{flex: 1}}
            >

                <StudentStack.Navigator initialRouteName={'StudentScreen'}>

                    <StudentStack.Screen name={'StudentScreen'} initialParams={props} component={StudentScreen}
                                         options={{
                                             headerShown: false,
                                             gesturesEnabled: false,
                                             animationEnabled: false,
                                         }}/>

                    <StudentStack.Screen name={'AuthPersonListScreen'} initialParams={props}
                                         component={AuthPersonListScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'FormScreen'} initialParams={props} component={FormScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'FormListScreen'} initialParams={props} component={FormListScreen}
                                         options={{
                                             headerShown: false,
                                             gesturesEnabled: false,
                                             animationEnabled: false,
                                         }}/>

                    <StudentStack.Screen name={'FormEditScreen'} initialParams={props} component={FormEditScreen}
                                         options={{
                                             headerShown: false,
                                             gesturesEnabled: false,
                                             animationEnabled: false,
                                         }}/>


                    <StudentStack.Screen name={'StudentNotificationList'} initialParams={props}
                                         component={StudentNotificationList} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                </StudentStack.Navigator>
            </KeyboardAvoidingView>
        </ErrorBoundary>
    );
}
