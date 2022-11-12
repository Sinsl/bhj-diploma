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

    xhr.addEventListener('load', () => {
      callback(null, xhr.response);
    });
  }
  catch ( e ) {
    xhr.addEventListener('error', (e) => {
      console.log(`ОШИБКА createRequest: ${e}`);
      callback(e);
    });
  }
};
