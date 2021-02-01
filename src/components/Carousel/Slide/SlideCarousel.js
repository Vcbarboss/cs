import React from 'react'
import {StyleSheet, View} from 'react-native'

export const Slide = (props: any) => {

  const { component } = props;

  return (
    <View style={styles.slide}>
      {component}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    paddingBottom: 10,
    paddingTop: 30,
    flexBasis: '100%',
    flex: 1,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  slideText: {
    width: '100%',
    textAlign: 'left',
    fontSize: 20,
  },
});

export default Slide;
