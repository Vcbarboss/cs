import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {EmptyComponent} from "./EmptyComponent";
import errorImg from "../assets/imgs/logo.png";
import {Env} from "../Env";
import {maskPhone} from "../helpers/Functions";

import * as Sentry from '@sentry/react-native';

export default class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  sendErrorToSentry = async (error, errorInfo) => {
    Sentry.captureException(error);
  };

  static getDerivedStateFromError(error) {
    return { error: true };
  }
  componentDidCatch(error, errorInfo) {
    this.sendErrorToSentry(error, errorInfo);
  }

  render() {
    if(this.state.error) {
      return(<View style={{flex: 1}}>
        <EmptyComponent image={errorImg} buttonText={'Recarregar'} onPress={() => this.setState({error: false})} title={'Ops, algo deu errado )='} subTitle={'Buscaremos corrigir isto o mais rápido possível, caso o erro persista, mande uma mensagem em nosso whatsapp - ' + Env.number}/>
      </View>);
    } else {
      return this.props.children;
    }
  }
}
