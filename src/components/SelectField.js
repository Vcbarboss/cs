import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, Platform, StyleSheet, Text, TouchableOpacity, View, Switch, SafeAreaView} from 'react-native';
import {Colors} from "../helpers/Colors";
import PropTypes from "prop-types";
import Field from "./Field";
import Icon from 'react-native-vector-icons/Ionicons';

export default function SelectField(props) {

  const [selected, setSelected] = useState(props.initialValue && props.initialValue);
  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState()
  const [selectedCount, setSelectedCount] = useState(0);
  const [switchValue, setSwitchValue] = useState(props.selectedList?.length > 0 ? true : false);

  const handleChange = (e) => {
    if(e.value !== undefined) {
      setSelected(e.label);
    } else {
      setSelected(undefined);
    }
    setIsVisible(false);
    props.change(e.value);
  };

  const handleSelect = (item) => {
    let aux = props.selectedList;
    if(!aux.includes(item.value)) {
      aux.push(item.value);
      props.change(aux);
      setSelectedCount(selectedCount + 1);
    } else if(aux.length > 0) {
      aux.splice(aux.indexOf(item.value), 1);
      props.change(aux);
      setSelectedCount(selectedCount - 1);
    }
  };

  const handleSwitch = () => {
    if(switchValue) {
      setSwitchValue(false);
      props.change([]);
    } else {
      setSwitchValue(true);
      setIsVisible(true)
    }
  };

  return (
    <View>
      {props.multiple?
        <View style={{marginHorizontal: 10, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'gainsboro', flexDirection: 'row', alignItems: 'flex-end'}}>
          {props.icon&& <Icon style={[styles.icon,{ marginBottom: 15}]} name={props.icon} size={24} color={props.color || Colors.primary}/>}
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{ marginLeft: 5,flex: 1, fontWeight: 'bold', color: props.color || Colors.primary}}>{props.label&& props.label}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                  style={{ transform: Platform.OS === "ios" ?[{ scaleX: .5 }, { scaleY: .5 }] : [{ scaleX: 1 }, { scaleY: 1 }] }}
                  trackColor={{ false: Colors.lightgray, true: 'rgba(117,202,37,0.55)'}}
                  thumbColor={switchValue? Colors.secondary : "#bdbcbd"}
                  onValueChange={() => handleSwitch()} value={switchValue}/>
                <Text> {switchValue? 'Sim' : 'Não'} </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', paddingBottom: 5, paddingTop: 5, flexWrap:'wrap'}}>
              {props.selectedList.map((item,index) =>
                <View key={index} style={{backgroundColor: Colors.primary, borderRadius: 20, marginHorizontal: 2, marginBottom: 3, padding: 5, paddingHorizontal: 10}}>
                  <Text style={{color: Colors.white}}>
                    {item}
                  </Text>
                </View>
              )}
              {props.selectedList.length > 0&&
              <TouchableOpacity onPress={() => setIsVisible(true)} style={{backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 1, borderRadius: 20, marginHorizontal: 2, marginBottom: 3, padding: 5, paddingHorizontal: 10}}>
                <Text style={{color: Colors.primary}}>
                  Toque para editar
                </Text>
              </TouchableOpacity>
              }
            </View>
          </View>
        </View>
        :
        <View>
          <Field icon={props.icon && props.icon} value={selected} label={props.label&& props.label} placeholder={props.placeholder&& props.placeholder} rightIcon={'chevron-down-outline'}/>
          <TouchableOpacity onPress={() => setIsVisible(true)} style={{position: 'absolute', zIndex: 10, width: '100%', height: '100%'}}/>
        </View>}

      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(false)
        }}
      >
        <SafeAreaView>
          <TouchableOpacity onPress={() => setIsVisible(false)} style={{padding: 15, paddingLeft: 5, flexDirection: 'row', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: Colors.lightgray}}>
            <Icon size={24} name='arrow-back-outline' color={Colors.dark}/>
            <Text style={{fontSize: 20, marginLeft: 15}}> Selecione </Text>
          </TouchableOpacity>
          <ScrollView>
            {props.list.map((item, index) => (
                <TouchableOpacity style={[styles.list, {borderBottomWidth: index+1 === props.list.length? 0 : 1, backgroundColor: props.multiple&& props.selectedList.includes(item.value)? '#f7f7f7' : Colors.white }]} key={index} onPress={() => {
                  props.multiple? handleSelect(item) : handleChange(item)
                }}>
                  <Icon size={20} name='chevron-forward-outline' color='#517fa4'/>
                  <Text style={{fontWeight: props.multiple&& props.selectedList.includes(item.value)? 'bold' : '400', color: props.multiple&& props.selectedList.includes(item.value)? Colors.secondary : Colors.dark }}> {item.label} </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
SelectField.propTypes = {
  list: PropTypes.array,
  change: PropTypes.func,
  selectedList: PropTypes.array,
  multiple: PropTypes.bool,
  initialValue: PropTypes.any,
  label: PropTypes.string
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
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      height: 55,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'gainsboro'
    },
  },
);
