import React, {useRef, useState} from 'react';
import {Dimensions, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Text, View, Modal, Platform} from 'react-native';
import useApi from '../../hooks/Api';
import SelectField from '../../components/SelectField';
import {Colors} from "../../helpers/Colors";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";
import {maskCpf, maskDate} from "../../helpers/Functions";
import Toast from "../../components/Toast";
import moment from "moment";
import useAuth from "../../hooks/Auth";
import useCpfValidation from "../../hooks/ValidateCpf";
import Field from "../../components/Field";
import {Env} from "../../Env";
import useLocalStorage from '../../hooks/Storage';
import {KeyboardControl} from '../../helpers/KeyboardControl';
import {useFocusEffect} from '@react-navigation/native';
const screenHeight = Math.round(Dimensions.get('window').height);
import {Checkbox, Switch} from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";
import WebView from 'react-native-webview';


export function RegisterScreen({route, navigation}) {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const api = useApi({navigation});
  const {register, setFcmToken} = useAuth();
  const userPhoneStorage = useLocalStorage('userPhone');

  const [first_name, setFirstName] = useState(undefined);
  const [last_name, setLastName] = useState(undefined);
  const [gender, setGender] = useState(undefined);
  const [birthday, setBirthday] = useState(undefined);
  const [cpf, setCpf] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const refNotification = useRef();
  const param = route.params;
  const {validateCpf} = useCpfValidation();
  const [showButton, setShowButton] = useState(true);

  const [checked, setChecked] = useState(false);
  const [termsTouch, setTermsTouch] = useState(false);

  const handleSave = async () => {
    if(!checked) {refNotification.current.showToast('warning','É necessário concordar com as políticas de privacidade','Para continuar é necessário aceitar os termos e políticas de privacidade.'); return;}
    if(!first_name) {refNotification.current.showToast('warning','Campo obrigatório','Informe o seu primeiro nome corretamente'); return;}
    if(!last_name) {refNotification.current.showToast('warning','Campo obrigatório','Informe o seu último nome corretamente'); return;}
    if(!gender) {refNotification.current.showToast('warning','Campo obrigatório','Informe o seu gênero'); return;}
    if(!birthday) {refNotification.current.showToast('warning','Campo obrigatório','Informe sua data de nascimento');return;}
    if(!cpf) {refNotification.current.showToast('warning','Campo obrigatório','Informe o seu CPF corretamente'); return;}
    if(!password) {refNotification.current.showToast('warning','Campo obrigatório','Informe uma senha para seu cadastro'); return;}
    if(!email) {refNotification.current.showToast('warning','Campo obrigatório','Informe o seu email corretamente'); return;}

    if(moment(birthday, 'DD/MM/YYYY').isValid()) {
      if(moment().diff(moment(birthday, 'DD/MM/YYYY'), 'years') <= 13) {
        refNotification.current.showToast('warning','Idade não permitida','Você deve ter no mínimo 14 anos de idade');
        return;
      }
    } else {
      refNotification.current.showToast('warning','Campo inválido','Informe sua data de nascimento corretamente (DIA/MÊS/ANO)');
      return;
    }
    if(!validateCpf(cpf)) {
      refNotification.current.showToast('warning','CPF inválido','Informe um CPF válido');
      return;
    }
    setLoading(true);

    const tokenAux =  await messaging().getToken();
    await setFcmToken(tokenAux); //TODO arrancar

    try {
      const res = await api.post(`register/worker`, {
        first_name,
        application_name: Env.application_name,
        last_name,
        gender,
        birthday: moment(birthday,'DD/MM/YYYY').format('YYYY-MM-DD'),
        cpf: cpf.replace(/\D/ig, ''),
        password: password,
        email,
        cellphone_number: '+55' + param.phone.replace(/\D/ig, ''),
        mobile_verified: false,
        fcm_token: tokenAux
      });
      await register(res);
      await userPhoneStorage.setPrimitive('+55' + param.phone.replace(/\D/ig, ''));
      navigation.reset({index: 0, routes: [{ name: 'WelcomeIntro'}],});
    } catch (e) {
      let aux;
      for (let i = 0; i < Object.keys(e.validator).length; i++) {
        aux = e.validator[Object.keys(e.validator)[i]][0];
        break;
      }
      refNotification.current.showToast("warning", aux || "Conexão com servidor não estabelecida");

    }
  };

  const handleMaskCpf = (value) => {
    let aux = maskCpf(value);
    if(aux !== null) {
      setCpf(aux);
    }
  }

  const handleMaskDate = (value) => {
    let aux = maskDate(value);
    if(aux !== null) {
      setBirthday(aux);
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <Toast ref={refNotification}/>
      <View style={styles.background}>
        <ScrollView >
          <View style={{marginBottom: 30}}>
            <Text style={[styles.text, {color: Colors.dark,}]}>Complete as informações abaixo </Text>
          </View>
          <View>
            <Field icon={'person'} placeholder={'Seu Nome'} label={'Nome'} value={first_name} change={(e) => setFirstName(e)}/>
            <Field icon={'people'}  placeholder={'Seu Sobrenome'} label={'Sobrenome'} value={last_name} change={(e) => setLastName(e)}/>
            <Field icon={'key'}  secureTextEntry={true} placeholder={'Sua Senha'} value={password} label={'Senha'} change={(e) => setPassword(e)}/>
            <Field icon={'card'}  keyboardType={'number-pad'} placeholder={'Seu CPF'} value={cpf} label={'CPF'} change={(e) => handleMaskCpf(e)}/>
            <Field icon={'mail'}  placeholder={'Seu Email'} value={email} label={'Email'} change={(e) => setEmail(e)}/>
            <Field icon={'calendar'}  keyboardType={'number-pad'} placeholder={'Sua Data de nascimento'} value={birthday} label={'Nascimento'} change={(e) => handleMaskDate(e)}/>

          </View>
        </ScrollView>
        {(showButton) &&<View style={{flexDirection: 'row', margin: 10, marginTop: 5, marginBottom: 0}}>
          {Platform.OS !== "ios"?
            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: checked? '#f3fef2' : '#f9f9f9', borderWidth: 1, borderColor: 'gainsboro', borderRadius: 10, padding: 10}}>
              <Checkbox color={Colors.primary} status={checked? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)}/>
              <TouchableOpacity onPress={() => setTermsTouch(true)}>
                <Text style={{fontSize: 13, maxWidth: '90%'}}> Ao tocar em Cadastre-se você concorda com nossos <Text style={{fontWeight: 'bold', fontSize: 14, color: Colors.primary}}> Termos e Políticas de privacidade </Text> </Text>
              </TouchableOpacity>
            </View>

            :
            <>
              <View style={{flexDirection: 'row'}}>
                <Switch
                  style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                  trackColor={{ false: Colors.lightgray, true: 'rgba(117,202,37,0.55)'}}
                  thumbColor={checked? Colors.secondary : "#bdbcbd"}
                  onValueChange={() => setChecked(!checked)} value={checked}/>
              </View>

              <TouchableOpacity onPress={() => setTermsTouch(true)}>
                <Text style={{fontSize: 14, maxWidth: '90%', color: Colors.primary}}>Ao tocar em Cadastre-se você concorda com nossos
                  <Text style={{fontWeight: 'bold', fontSize: 14, color: Colors.primary}}> Termos e Políticas de privadidade </Text>
                </Text>
              </TouchableOpacity>
            </>
          }
        </View>}

        {(showButton) &&<View style={{marginTop: 10}}>
          <ButtonStyle1
            text={'Cadastre-se'}
            style={{margin: 3, padding: 10}}
            primaryColor={Colors.secondary}
            secondaryColor={Colors.secondary}
            color={Colors.primary}
            loading={loading}
            disabled={!checked}
            borderRadius={20}
            onPress={() => handleSave()}
          />
        </View>}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={termsTouch}
        onRequestClose={() => {
          setTermsTouch(false)
        }}
      >
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity onPress={() => setTermsTouch(false)} style={{padding: 15, paddingLeft: 5, flexDirection: 'row', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: Colors.lightgray}}>
            <Icon size={24} name='arrow-back-outline' color={Colors.dark}/>
            <Text style={{fontSize: 20, marginLeft: 15}}> Termos </Text>
          </TouchableOpacity>

          <WebView
            source={{ uri: Env.application_web_url + '/termos' }}
            style={{ marginTop: 20 }}
          />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>

  );
}
;


const styles = StyleSheet.create({
  bg : {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  background: {
    paddingTop: 22,
    paddingHorizontal: 22,
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 20,
    paddingLeft: 5,
    fontWeight: '700',
    textAlign: 'left',
  },
  icon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  container: {
    marginTop: -2,
    marginBottom: -2,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 55,
  },
  field: {
    height: 52,
    fontWeight: '400',
    backgroundColor: 'white',
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 20,
    borderRadius: 4,
    height: 50,
    overflow: 'hidden',

  },
  whiteModal: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(196,196,196,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 10,
  },
  whiteModalChildren: {
    padding: 20,
    backgroundColor: 'white',
    width: '70%',
    elevation: 3,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    minHeight: 200,
  },

});
