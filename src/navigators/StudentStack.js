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
import {DocumentSendScreen} from "../screens/Student/DocumentSendScreen";
import {ReportScreen} from "../screens/Student/Report/ReportScreen";
import {ReportDetailsScreen} from "../screens/Student/Report/ReportDetailsScreen";
import {ClassScheduleScreen} from "../screens/Student/ClassScheduleScreen";
import {HomeworkListScreen} from "../screens/Student/HomeworkListScreen";
import {AttendanceListScreen} from "../screens/Student/Attendance/AttendanceListScreen";
import {AttendanceDetailsScreen} from "../screens/Student/Attendance/AttendanceDetailsScreen";
import {KnowledgeScreen} from "../screens/Student/KnowledgeScreen";
import {HomeworkDetailsScreen} from "../screens/Student/Homework/HomeworkDatailsScreen";
import {AnimationScreen} from "../screens/Student/AnimationScreen";

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

                    <StudentStack.Screen name={'ClassScheduleScreen'} component={ClassScheduleScreen} options={{
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

                    <StudentStack.Screen name={'DocumentSendScreen'} initialParams={props}
                                         component={DocumentSendScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'ReportScreen'} initialParams={props}
                                         component={ReportScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'ReportDetailsScreen'} initialParams={props}
                                         component={ReportDetailsScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'KnowledgeScreen'} initialParams={props}
                                         component={KnowledgeScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'AttendanceListScreen'} initialParams={props}
                                         component={AttendanceListScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'AttendanceDetailsScreen'} initialParams={props}
                                         component={AttendanceDetailsScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'HomeworkListScreen'} initialParams={props}
                                         component={HomeworkListScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'HomeworkDatailsScreen'} initialParams={props}
                                         component={HomeworkDetailsScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                    <StudentStack.Screen name={'AnimationScreen'} initialParams={props}
                                         component={AnimationScreen} options={{
                        headerShown: false,
                        gesturesEnabled: false,
                        animationEnabled: false,
                    }}/>

                </StudentStack.Navigator>
            </KeyboardAvoidingView>
        </ErrorBoundary>
    );
}
