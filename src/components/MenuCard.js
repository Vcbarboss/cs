import React, { useRef } from "react";
import {
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity, Image,
} from "react-native";

import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../helpers/Texts";
import image from "../assets/imgs/userStudent.png";

export default function MenuCard(props) {

  return (
    <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20, paddingVertical: 10 }}>
      {/*<View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>*/}
      {/*<View style={{*/}
      {/*  alignItems: "center",*/}
      {/*  justifyContent: "center",*/}
      {/*  backgroundColor: props.bg,*/}
      {/*  borderRadius: 50,*/}
      {/*  width: 60,*/}
      {/*  height: 60,*/}
      {/*}}>*/}
      {/*  <AntIcon name={props.icon} style={{}} size={35} color={props.iconColor} />*/}
      {/*</View>*/}
      {/*</View>*/}
      <View style={{ flex: 1, padding: 5 }}>
        <View style={{ flex: 1, padding: 5 }}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View style={{ flex: 1, padding: 5, justifyContent: "flex-end" }}>
          <Text style={styles.subtitle}>{props.title}</Text>
        </View>
      </View>
      <View style={{ flex: 0.5, alignItems: "flex-end", justifyContent: "center" }}>
        {/*<AntIcon name={"right"} style={{}} size={40} color={Colors.primary} />*/}
        <Image source={props.img} style={styles.img} />
      </View>
    </View>
  );
}

MenuCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  rightIconColor: PropTypes.string,
  bg: PropTypes.string,
};

const styles = StyleSheet.create({
    title: {
      color: 'white',
      fontSize: Texts.title,
      fontWeight: "bold",
    },

    subtitle: {
      color: 'white',
      fontSize: Texts.subtitle,
    },
    icon: {
      marginRight: 6,
    },
    img: {
      width: "100%",
      resizeMode: "contain",
      flex: 1,
    },
    rightIcon: {},
  },
);
