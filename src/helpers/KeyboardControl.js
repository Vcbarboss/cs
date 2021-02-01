import React from 'react';
import {Keyboard} from 'react-native';

export const KeyboardControl = {

  keyboardDidShowListener: null,
  keyboardDidHideListener: null,

  init: () => {
    KeyboardControl.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', KeyboardControl._onShow);
    KeyboardControl.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', KeyboardControl._onHide);
  },

  remove: () => {
    KeyboardControl.keyboardDidShowListener.remove();
    KeyboardControl.keyboardDidHideListener.remove();
  },

  _onShow: () => {
    if (typeof  KeyboardControl.onShow === 'function')
      KeyboardControl.onShow();
  },

  _onHide: () => {
    if (typeof  KeyboardControl.onHide === 'function')
      KeyboardControl.onHide();
  }
}
