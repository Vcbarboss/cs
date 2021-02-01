import {Env} from "../Env";
import useLocalStorage from "./Storage";
import {useDispatch} from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch();
  const userStorage = useLocalStorage('user');
  const fcmStorage = useLocalStorage('fcm-token');

  const login = async (userObj, token) => {
    Env.header[`userToken`] = token;
    //userObj.hasProfile = profile;
    dispatch({type: 'init_login', data: userObj});
    await userStorage.setObject(userObj);
  };

  const register = async (userObj, token) => {
    Env.header[`userToken`] = token;
    userObj.hasProfile = false;
    dispatch({type: 'init_login', data: userObj});
    await userStorage.setObject(userObj);
  };

  const logoutWithoutApi = async () => {
    await userStorage.remove();
    await fcmStorage.remove();
    delete Env.header[`userToken`];
    dispatch({type: 'logout'});
  };

  const getUser = async () => {
    return await userStorage.getObject();
  };

  const isLogged = async () => {
    return await !!userStorage.getObject()?.user_id;
  };

  const getFcmToken = async () => {
    return await fcmStorage.getPrimitive();
  };

  const setFcmToken = async (item) => {
    return await fcmStorage.setPrimitive(item);
  };

  const updateContactInfo = async (phone, mail) => {
    let auxUser = await getUser();
    if(phone) {
      auxUser.object.person.contact_mobile_phone = phone
    }
    if(mail) {
      auxUser.object.person.contact_mail = mail
    }
    await userStorage.setObject(auxUser);
    dispatch({type: 'init_login', data: auxUser});
  }

  return {login,logoutWithoutApi, updateContactInfo, getUser, register, isLogged, getFcmToken, setFcmToken};
};

useAuth.propTypes = {};

export default useAuth;
