import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  SafeAreaView,
} from "react-native";
import { Colors } from "../helpers/Colors";
import PropTypes from "prop-types";
import Field from "./Field";
import Icon from "react-native-vector-icons/Ionicons";
import { Checkbox } from "react-native-paper";
import ButtonStyle1 from "./Buttons/ButtonStyle1";


export default function
  FilterNotification(props) {

  const [selected, setSelected] = useState(props?.selected  );

  const handleFilter = (item) => {
    props.select(item)
    props.close(false)
  }


  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 10 }}> {props.title} </Text>
      {props.list.map((item, index) =>
          <View key={index} style={{ margin: 10, marginTop: 5, marginBottom: 0 }}>
            {Platform.OS !== "ios" ?
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selected === item.label ? Colors.selected : "#f9f9f9",
                borderWidth: 1,
                borderColor: selected === item.label ? Colors.selectedBorder : Colors.lightgray,
                borderRadius: 10,
                padding: 10,
              }}>
                <Checkbox color={Colors.primary}
                          status={selected === item.label ? "checked" : "unchecked"}
                          onPress={() => handleFilter(item)} />
                <TouchableOpacity style={{flex: 1}}
                  onPress={() => handleFilter(item)}>
                  <Text style={{ fontSize: 12, maxWidth: "100%" }}> {item.label}</Text>
                </TouchableOpacity>
              </View>

              :
              <>
                <View style={{ flexDirection: "row" }}>
                  <Switch
                    style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                    trackColor={{ false: Colors.lightgray, true: "rgba(117,202,37,0.55)" }}
                    thumbColor={selected === item.label ? Colors.secondary : "#bdbcbd"}
                    onValueChange={() => handleFilter(item)}
                    value={selected === item} />
                </View>

                <TouchableOpacity style={{flex: 1}}
                  onPress={() => handleFilter(item)}>
                  <Text
                    style={{ fontSize: 12, maxWidth: "100%", color: Colors.primary }}>{item.label}
                  </Text>
                </TouchableOpacity>
              </>
            }
          </View>,
      )}

      {/*<ButtonStyle1*/}
      {/*  text={"Filtrar"}*/}
      {/*  style={{ margin: 3, padding: 8, marginTop: 10 }}*/}
      {/*  primaryColor={Colors.primary}*/}
      {/*  secondaryColor={Colors.primary}*/}
      {/*  color={Colors.white}*/}
      {/*  borderRadius={15}*/}
      {/*  onPress={() => {*/}
      {/*      handleFilter()*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  );
}
FilterNotification.propTypes = {
  list: PropTypes.array,
  selected: PropTypes.any,
};
const styles = StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
    container: {
      marginTop: -2,
      marginBottom: -2,
      paddingLeft: 10,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      height: 55,
    },
    list: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "gainsboro",
    },
  },
);
