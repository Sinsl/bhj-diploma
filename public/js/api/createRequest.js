/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options) => {
  
  const {url, method, data, callback} = options;
  
  const xhr = new XMLHttpRequest();

  try {
    xhr.open( method, url );
    xhr.responseType = 'json';
    xhr.send(data);
  }
  catch ( e ) {
    console.log(`ОШИБКА createRequest: ${e}`);
  }
  
  xhr.addEventListener('load', () => {
    callback(null, xhr.response);
  });
};
