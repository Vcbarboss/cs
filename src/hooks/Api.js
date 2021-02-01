import React, {useCallback, useState,} from 'react';
import {Env} from '../Env';
import useAuth from "./Auth";

const useApi = (config?: { apiUrl?: string, header?: string, customReturn?: boolean, navigation?: any }) => {

  const [error, setError] = useState(false);
  const {logoutWithoutApi} = useAuth();
  if (!config) {
    config = {};
  }

  config.apiUrl = config.apiUrl || Env.api_url;
  config.header = config.header || Env.header;

  const put = (path, data) => {
    return new Promise((resolve, reject) => {
      _fetch(path, 'PUT', data).then(res => {
        resolve(res);
      }).catch(err => {
        setError(true);
        reject(err);
      });
    });
  };

  const post = useCallback((path, data) => {
    return new Promise((resolve, reject) => {

      _fetch(path, 'POST', data).then(res => {
        resolve(res);
      }).catch(err => {
        setError(true);
        reject(err);
      });
    });
  }, []);

  const get = useCallback((path) => {
    return new Promise((resolve, reject) => {
      _fetch(path, 'GET', null).then(res => {
        resolve(res);
      }).catch(err => {
        setError(true);
        reject(err);
      });
    });
  }, []);

  const del = useCallback((path) => {
    return new Promise((resolve, reject) => {
      _fetch(path, 'DELETE', null).then(res => {
        resolve(res);
      }).catch(err => {
        setError(true);
        reject(err);
      });
    });
  }, []);

  const _fetch = useCallback((path, method, data) => {
    return new Promise((resolve, reject) => {

      const obj = {
        method: method,
        headers:  config.header,
      };

      if (data) {
        obj.body = JSON.stringify(data);
      }
      //console.log(config.apiUrl + '/' + path);
      fetch(`${config.apiUrl}/${path}`, obj)
        .then((response) => {
          if (response.status !== 200) {
            if (response.status === 403) {
              logoutWithoutApi();
              config.navigation?.reset({  index: 0, routes: [{name: 'LoginScreen', params: {order: 0}}]});
              reject(403);
            }
            response.json().then(async res => {
              //console.log(res);
              reject(res);
            }).catch(err => {
              reject({error: 'Erro de aplicação'});
            });
          } else {
           // console.log('Status === 200');
            resolve(response.json());
          }
        })
        .catch(async err => {
          reject(err);
        });
    });
  }, [ config.apiUrl, config.customReturn]);

  return {post, get, del, put, error};
};

export default useApi;
