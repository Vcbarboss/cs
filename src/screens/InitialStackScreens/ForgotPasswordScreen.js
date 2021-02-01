import React, {useState, useRef} from 'react';
import {Image, StatusBar, StyleSheet, View, ImageBackground, TouchableOpacity, Dimensions, Text, Alert} from 'react-native';
import useApi from "../../hooks/Api";
import useAuth from '../../hooks/Auth';
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import {Colors} from "../../helpers/Colors";
import {Env} from "../../Env";
import Field from "../../components/Field";
import useLocalStorage from '../../hooks/Storage';
import {maskPhone, validateMobilePhone} from '../../helpers/Functions';
import Toast from '../../components/Toast';
import {KeyboardControl} from '../../helpers/KeyboardControl';
import {useFocusEffect} from '@react-navigation/native';


export function ForgotPasswordScreen ({navigation}){

  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const api = useApi({navigation});

  const refNotification = useRef();
  const [showButton, setShowButton] = useState(true);


  const doForgotPassword = async () => {
    setLoading(true);
    try {
      const res = await api.post(`access/forgot-password-web`, {email: email, cpf: cpf.replace(/[^0-9]/g, ''), application_name: Env.application_name});
      Alert.alert('Recuperação solicitada', 'As instruções de recuperação de senha foram enviadas para o seu Email!');
      navigation.reset({index: 0, routes: [{ name: 'LoginScreen'}]});
    } catch (e) {
      setLoading(false);
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

    }
  };

  useFocusEffect(
    React.useCallback(() => {
      KeyboardControl.init();
      KeyboardControl.onShow = () => (setShowButton(false));
      KeyboardControl.onHide = () => (setShowButton(true));

      return () => KeyboardControl.remove();
    }, [])
  );



  return (
    <View style={styles.container}>
       <Toast ref={refNotification}/>

      <StatusBar
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      {showButton &&<View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 22,  marginBottom: 10,  maxWidth: '90%', fontWeight: 'bold', textAlign: 'center'}}> Informe os campos abaixo </Text>
        <Text style={{fontSize: 16, color: Colors.dark, marginBottom: 20, maxWidth: '90%',  textAlign: 'center'}}> Informe abaixo para iniciar o processo de recuperar sua senha </Text>
      </View>}

      <View>
        <Field
          placeholder='Informe seu Email'
          label={'Email'}
          value={email}
          change={(e) => setEmail(e)}
          icon={'mail'}
        />

        <Field
          placeholder='Informe seu CPF'
          label={'CPF'}
          value={cpf}
          keyboardType={'number-pad'}
          change={(e) => setCpf(e)}
          icon={'card'}
        />
      </View>

      <View style={{display: 'flex'}}>
        <ButtonStyle1
          text={'Recuperar'}
          style={{margin: 3, padding: 10}}
          loading={loading}
          primaryColor={Colors.secondary}
          secondaryColor={Colors.secondary}
          color={Colors.primary}
          borderRadius={40}
          onPress={() => doForgotPassword()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg : {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    padding: 16,
    display: 'flex',
    justifyContent: 'space-around'
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    flex: 1
  }
});
