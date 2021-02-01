import React, {useRef} from 'react';
import {Image, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';


import {Colors} from "../../helpers/Colors";
import Carousel from "../../components/Carousel/Carousel";
import ButtonStyle1 from "../../components/Buttons/ButtonStyle1";


const WelcomeIntroScreen = ({route, navigation}) => {

  const carouselRef = useRef();
  const handleEnd = () => {
    navigation.navigate('LoadingScreen')
  }

  const handleNext = (item) => {
    carouselRef.current.scrollToInterval(item);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ios: 'padding'})} style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <View style={{flex: 1}}>
        <Carousel
          style='slide'
          itemsPerInterval={1}
          ref={carouselRef}
          items={[{
            component: <View style={styles.background}>
              <View>
                <Text style={[styles.text, {color: Colors.dark,}]}>Seja bem-vindo(a) ao MS Contrata+ para Trabalhadores </Text>
              </View>
              <View style={{flex: 1, paddingTop: 20}}>
                <Image source={contrata_logo} style={styles.logo}/>
              </View>
              <View style={{paddingVertical: 40}}>
                <Text style={styles.subText}>O MS Contrata+ é uma ferramenta gratuita oferecida pela FUNTRAB-MS e Governo do Estado de MS para reforçar a empregabilidade da população Sul-mato-grossense</Text>
              </View>
              <View style={styles.mainView}>
                <ButtonStyle1
                  text={'Próximo'}
                  primaryColor={Colors.primary}
                  secondaryColor={Colors.primary}
                  color={Colors.white}
                  borderRadius={30}
                  onPress={() => handleNext(0.33)}
                />
              </View>
            </View>,
          }, {
            component: <View style={styles.background}>
              <View>
                <Text style={[styles.text, {color: Colors.dark,}]}>Está a procura de uma oportunidade de trabalho? </Text>
              </View>
              <View style={{flex: 1, paddingTop: 20}}>
                <Image source={pretenses} style={styles.logo}/>
              </View>
              <View style={{paddingVertical: 40}}>
                <Text style={styles.subText}>
                  Cadastre já seu currículo para ser encontrado facilmente pelos empregadores em todo o estado. É facil, rápido e gratuito!
                </Text>
              </View>
              <View style={styles.mainView}>
                <ButtonStyle1
                  text={'Próximo'}
                  primaryColor={Colors.primary}
                  secondaryColor={Colors.primary}
                  color={Colors.white}
                  onPress={() => handleNext(0.66)}
                  borderRadius={30}
                />
              </View>
            </View>,
          }, {
            component: <View style={styles.background}>
              <View>
                <Text style={[styles.text, {color: Colors.dark,}]}>Precisa de atendimento presencial em uma unidade da FUNTRAB? </Text>
              </View>
              <View style={{flex: 1, paddingTop: 20}}>
                <Image source={funtrab} style={styles.logo}/>
              </View>
              <View style={{paddingVertical: 40}}>
                <Text style={styles.subText}>
                  Seja para agendar atendimento presencial nas unidades FUNTRAB, pedir Seguro-Desemprego ou sua nova carteira de trabalho digital. Faça tudo pelo app MS Contrata+!
                </Text>
              </View>
              <View style={styles.mainView}>
                <ButtonStyle1
                  text={'Ok, Entendi'}
                  primaryColor={Colors.primary}
                  secondaryColor={Colors.primary}
                  color={Colors.white}
                  onPress={() => handleEnd()}
                  borderRadius={30}
                />
              </View>
            </View>
          }]}
        />
      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingTop: 22,
    paddingHorizontal: 22,
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'space-between',
    height: '100%',
  },
  mainView: {
    display: 'flex',
    marginBottom: Platform.select({ios: '20%', android: 0}),
  },
  button: {
    fontSize: 20,
    backgroundColor: 'transparent'
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    flex: 1
  },
  text: {
    fontSize: 25,
    paddingLeft: 5,
    fontWeight: '700',
    textAlign: 'left',
  },
  subText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 25,
    color: Colors.grey,
  },
});

export default WelcomeIntroScreen;
