import React, { useRef } from "react";
import {

  StyleSheet,
  Text,
  View,
  TouchableOpacity, Image,
} from "react-native";

import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../helpers/Colors";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Texts } from "../helpers/Texts";

export default function Header(props) {

  return (
    <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20, paddingVertical: 10 }}>
     <Text>Header</Text>
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
