import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

export const Stat = (props: any) => {

  const { label, value } = props;

  return (
    <View style={styles.stat}>
      <Text style={{ ...styles.statText }}>
        {value}
      </Text>
      <View style={styles.statHold}>
        <Text style={{ ...styles.statLabel }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 30,
    flexBasis: '33%',
    flex: 1,
    maxWidth: '33%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  statText: {
    width: '100%',
    textAlign: 'left',
    fontSize: 20,
  },
  statHold: {
    width: '100%',
    marginBottom: 8,
  },
  statLabel: {
    width: '100%',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: '600',
    paddingTop: 5,
  },
});


export default Stat;
