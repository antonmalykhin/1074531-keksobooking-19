'use strict';

(function () {

  var RESPONSE_TYPE = 'json';

  var Url = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };

  var Timeout = {
    LOAD: 10000,
    MESSAGE: 3000
  };

  var ErrorText = {
    STATUS: 'Статус ответа: ',
    DISCONNECT: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за ',
    TIME: 'мс'
  };

  var StatusCode = {
    OK: 200
  };

  var main = document.querySelector('main');
  var notice = main.querySelector('.notice');


  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError(ErrorText.STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(ErrorText.DISCONNECT);
    });

    xhr.addEventListener('timeout', function () {
      onError(ErrorText.TIMEOUT + xhr.timeout + ErrorText.TIME);
    });

    xhr.timeout = Timeout.LOAD;

    xhr.open('GET', Url.LOAD);
    xhr.send();
  };


  var upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError(ErrorText.STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(ErrorText.DISCONNECT);
    });

    xhr.open('POST', Url.UPLOAD);
    xhr.send(data);
  };

  var onErrorLoad = function (errorText) {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorMessage = errorMessageTemplate.cloneNode();
    var errorMessageText = document.createElement('p');

    errorMessageText.classList.add('error__message');
    errorMessageText.innerText = errorText;

    errorMessage.appendChild(errorMessageText);

    main.insertBefore(errorMessage, notice);
    window.setTimeout(function () {
      errorMessage.remove();
      window.page.reset();
    }, Timeout.MESSAGE);

  };

  var onErrorUpload = function (errorText) {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorMessage = errorMessageTemplate.cloneNode(true);
    var errorMessageText = errorMessage.querySelector('.error__message');
    errorMessageText.innerText = errorText;
    var tryAgainBtn = errorMessage.querySelector('.error__button');

    main.insertBefore(errorMessage, notice);

    var closeErrorMessage = function () {
      errorMessage.remove();
      tryAgainBtn.removeEventListener('click', onTryAgainBtnClick);
      document.removeEventListener('keydown', onEscapeKeyPress);
      document.removeEventListener('click', onEmptyAriaClick);
    };

    var onTryAgainBtnClick = function () {
      closeErrorMessage();
    };

    var onEscapeKeyPress = function () {
      closeErrorMessage();
    };

    var onEmptyAriaClick = function () {
      closeErrorMessage();
    };

    tryAgainBtn.addEventListener('click', onTryAgainBtnClick);
    document.addEventListener('keydown', onEscapeKeyPress);
    document.addEventListener('click', onEmptyAriaClick);
  };

  window.backend = {
    load: load,
    upload: upload,
    onErrorLoad: onErrorLoad,
    onErrorUpload: onErrorUpload
  };

})();
