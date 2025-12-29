export function resetForm() {
  const formElement = document.querySelector('.img-upload__form');
  const inputFile = formElement.querySelector('.img-upload__input');
  const hashtagsField = formElement.querySelector('.text__hashtags');
  const descriptionField = formElement.querySelector('.text__description');
  const overlayElement = document.querySelector('.img-upload__overlay');
  const imagePreview = overlayElement.querySelector('.img-upload__preview img');
  const sliderElement = document.querySelector('.effect-level__slider');
  const scaleValueField = document.querySelector('.scale__control--value');
  const submitButton = formElement.querySelector('.img-upload__submit');
  const effectNoneRadio = document.querySelector('input[name="effect"][value="none"]');

  // Сбрасываем данные формы и начальное состояние
  formElement.reset();
  imagePreview.src = '';
  hashtagsField.value = '';
  descriptionField.value = '';
  inputFile.value = '';
  submitButton.disabled = false;

  // Устанавливаем масштаб изображения на 100%
  scaleValueField.value = '100%';
  imagePreview.style.transform = 'scale(1)';

  // Возвращаем слайдер эффектов к исходному состоянию
  sliderElement.noUiSlider.set(100); // Максимальное значение интенсивности
  sliderElement.classList.add('hidden'); // Скрываем слайдер
  effectNoneRadio.checked = true; // Сбрасываем выбранный эффект на "Оригинал"
  imagePreview.className = ''; // Убираем классы эффектов
  imagePreview.style.filter = ''; // Убираем применённый CSS-фильтр

  // Закрываем окно формы и снимаем класс с body
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
}


export function showMessage(messageType) {
  const templateElement = document.querySelector(`#${messageType}`).content.querySelector(`.${messageType}`);
  const messageClone = templateElement.cloneNode(true);
  document.body.appendChild(messageClone);

  const closeButton = messageClone.querySelector(`.${messageType}__button`);

  // Функция для удаления сообщения
  function removeMessage() {
    messageClone.remove();
    document.removeEventListener('keydown', handleEscapeKey);
  }

  // Функция для обработки нажатия Escape
  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      removeMessage();
    }
  }

  // Закрытие сообщения при взаимодействии
  document.addEventListener('keydown', handleEscapeKey);
  closeButton.addEventListener('click', removeMessage);
  messageClone.addEventListener('click', (event) => {
    if (event.target === messageClone) {
      removeMessage();
    }
  });
}
