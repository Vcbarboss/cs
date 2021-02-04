import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from "../helpers/Colors";
import GeneralStatusBarColor from "./StatusBarColor";

const ToastNotification = React.forwardRef((props,ref) => {
  const [visible, setVisible] = useState(false);
  const type = useRef(undefined);
  const title = useRef(undefined);
  const message = useRef(undefined);

  let time1;

  const showToast = (notification) => {
    type.current = '';
    title.current = notification.notification.title;
    message.current = notification.notification.body;
    setVisible(true);
    hide()
  };


  const hideToast = () => {
    type.current = undefined;
    title.current = undefined;
    message.current = undefined;
    setVisible(false);
  };

  const onClick = () => {
    type.current = undefined;
    title.current = undefined;
    message.current = undefined;
    setVisible(false);

    props.navigation('NotificationScreen')
  };

  const hide = () =>{
    time1 = setTimeout(async () => {
      hideToast()
      clearTimeout(time1)
    }, 5000)

  }

  if(ref) ref.current = {showToast};

  return (<View>
      {visible&&
      <View style={[styles.main]} >
        <GeneralStatusBarColor backgroundColor={'transparent'}
                               barStyle="light-content"/>
        <View style={styles.middle}>
          <View style={[styles.subMain]}>
            <View style={{marginRight: 10}}>
              <Icon name='notifications-circle' size={40} color='#f4fae5'/>
            </View>
            <View style={{ flex: 1}}>
              <Text  numberOfLines={1}  style={[styles.title, { color: '#f4fae5'} ]}>
                {title.current}
              </Text>
              {message.current &&<Text  numberOfLines={3} style={[styles.text, { color:'#faf9e7'}]}>{message.current} </Text>}
            </View>
            <TouchableOpacity onPress={() => hideToast()} style={{flexDirection: 'row-reverse', zIndex: 100}}>
              <Icon name='close-outline' size={40}  color='white'/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      }
    </View>
  );
})

export default ToastNotification;
const styles = StyleSheet.create({
  main: {
    zIndex: 1000,
    width: '100%',
    top: 5,
    position: 'absolute',
  },
  middle: {
    backgroundColor: '#527eeb',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  subMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: '#52c41a',
    fontSize: 18,
    fontWeight: 'bold'
  },
  text: {
    color: '#52c41a'
  }},
);
