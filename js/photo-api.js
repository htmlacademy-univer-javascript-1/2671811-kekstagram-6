const API_BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

// Функция для получения данных с сервера
const getData = async () => {
  const response = await fetch(`${API_BASE_URL}/data`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные с сервера');
  }
  return await response.json();
};

// Функция для отправки данных на сервер
const sendData = async (formData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Не удалось отправить данные на сервер');
  }
  return await response.json();
};

export { getData, sendData };

