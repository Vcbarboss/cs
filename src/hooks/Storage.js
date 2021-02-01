import AsyncStorage from '@react-native-async-storage/async-storage';


const useLocalStorage = (key) => {

  const setPrimitive = async (value: string | boolean | number) => {
    await AsyncStorage.setItem(key, value);
  };

  const getPrimitive = async () => {
    return await AsyncStorage.getItem(key);
  };

  const setObject = async (value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  const getObject = async () => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  const remove = async () => {
    await AsyncStorage.removeItem(key);
  };

  return {setPrimitive, getPrimitive, getObject, setObject, remove}
};

useLocalStorage.propTypes = {};

export default useLocalStorage;
