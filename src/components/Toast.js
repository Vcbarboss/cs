import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from "../helpers/Colors";
import GeneralStatusBarColor from "./StatusBarColor";



const Toast = React.forwardRef((props,ref) => {
  const [visible, setVisible] = useState(false);
  const type = useRef(undefined);
  const title = useRef(undefined);
  const message = useRef(undefined);
  let time1;
  const showToast = (a, b, c) => {
    type.current = a;
    title.current = b;
    message.current = c;
    setVisible(true);
 hide()
  };

  const hideToast = () => {
    type.current = undefined;
    title.current = undefined;
    message.current = undefined;
    setVisible(false);
  };

  const hide = () =>{
    time1 = setTimeout(async () => {
      hideToast()
      clearTimeout(time1)
    }, 2000)

  }

  useEffect(() => {
  },[]);

  if(ref) ref.current = {showToast};

  return (<>
      {visible&&
      <View style={[styles.main]}>
          <GeneralStatusBarColor backgroundColor={'transparent'}
                                 barStyle="light-content"/>
        <View style={[styles.subMain, {backgroundColor:
            type.current === 'success'? '#caf3b7':
              type.current === 'error'? '#ffd1ce':
                '#ffd591'}]}>
          <View style={{marginRight: 10}}>
            {type.current === 'error' && <Icon name='close-circle-outline' size={40}  color='#f5222d'/>}
            {type.current === 'success' &&<Icon name='checkmark-circle-outline' size={40}  color='#52c41a'/>}
            {type.current === 'warning' &&<Icon name='warning-outline' size={40} color='#fa8c16'/>}
          </View>
          <View style={{ flex: 1}}>
            <Text style={[styles.title, { color: type.current === 'success'? '#52c41a': type.current === 'error'? '#f5222d': '#fa8c16'} ]}>
              {title.current? title.current: (type.current === 'success'? 'Tudo certo!' :(type.current === 'error'? 'Ops, ocorreu um erro' : 'Preencha corretamente as informações') )}
            </Text>
            {message.current &&<Text style={[styles.text, { color: type.current === 'success'? '#52c41a': type.current === 'error'? '#f5222d': '#fa8c16'}]}>{message.current} </Text>}
          </View>
          <TouchableOpacity onPress={() => {{/*clearTimeout(timer);*/} hideToast()}} style={{flexDirection: 'row-reverse'}}>
            <Icon name='close-outline' size={40}  color='white'/>
          </TouchableOpacity>
        </View>
      </View>
      }
    </>
  );
})

export default Toast;
const styles = StyleSheet.create({
  main: {
    zIndex: 1000,
    width: '100%',
    top: 10,
    position: 'absolute',
    elevation:6
  },
  subMain: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: '#52c41a',
    fontSize: 16,
    fontWeight: 'bold'
  },
  text: {
    color: '#52c41a'
  }},
);
