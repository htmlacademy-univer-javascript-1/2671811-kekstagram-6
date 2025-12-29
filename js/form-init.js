import { sendData } from './photo-api.js';
import { resetForm, showMessage } from './form-utils.js';

export function initForm(imageCollection, renderImageThumbnails) {
  const uploadFormElement = document.querySelector('.img-upload__form');
  const formValidator = new Pristine(uploadFormElement);
  const fileInputElement = uploadFormElement.querySelector('.img-upload__input');
  const modalOverlay = document.querySelector('.img-upload__overlay');
  const closeModalButton = modalOverlay.querySelector('.img-upload__cancel');
  const submitButton = uploadFormElement.querySelector('.img-upload__submit');
  const imagePreviewElement = modalOverlay.querySelector('.img-upload__preview img');
  const filterSliderContainer = document.querySelector('.effect-level');
  const filterSlider = document.querySelector('.effect-level__slider');
  const effectsRadioButtons = document.querySelectorAll('.effects__radio');
  const sliderValueElement = document.querySelector('.effect-level__value');
  const filterRadios = document.querySelectorAll('input[name="effect"]');
  const hashtagsField = uploadFormElement.querySelector('.text__hashtags');
  const descriptionField = uploadFormElement.querySelector('.text__description');

  let activeFilter = 'none';

  // Закрытие окна при нажатии на ESC
  // Функция закрытия модального окна
  function closeModal() {
    modalOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    resetForm();
    document.removeEventListener('keydown', handleEscKeyPress);
  }

  // Закрытие окна при нажатии на ESC
  function handleEscKeyPress(evt) {
    const isFieldFocused = document.activeElement === hashtagsField || document.activeElement === descriptionField;
    if (evt.key === 'Escape' && !isFieldFocused) {
      closeModal();
    }
  }

  // Отображение окна редактирования изображения при выборе файла
  fileInputElement.addEventListener('change', () => {
    const selectedFile = fileInputElement.files[0];
    if (selectedFile) {
      const tempImageUrl = URL.createObjectURL(selectedFile);
      imagePreviewElement.src = tempImageUrl;

      modalOverlay.classList.remove('hidden');
      document.body.classList.add('modal-open');

      imagePreviewElement.onload = () => {
        URL.revokeObjectURL(tempImageUrl);
      };

      document.addEventListener('keydown', handleEscKeyPress);
    }
  });

  // Закрытие окна редактирования через кнопку
  closeModalButton.addEventListener('click', closeModal);

  // Инициализация масштабирования изображения
  setupImageScalingControls();

  // Настройка слайдера для эффектов изображения
  noUiSlider.create(filterSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  // Функция для применения фильтров
  function applyFilter(filter) {
    if (filter === 'none') {
      // Скрываем контейнер слайдера для фильтра "Оригинал"
      filterSliderContainer.style.display = 'none';
    } else {
      // Показываем контейнер слайдера для других фильтров
      filterSliderContainer.style.display = '';
    }
  }

  // Навешиваем обработчики на радиокнопки
  effectsRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', (event) => {
      const selectedFilter = event.target.value; // Получаем значение выбранного фильтра
      applyFilter(selectedFilter);
    });
  });

  // Изначально скрываем слайдер, если выбран "Оригинал"
  applyFilter('none');

  filterSlider.classList.add('hidden'); // Скрываем слайдер при отсутствии эффекта
  document.querySelector('input[name="effect"][value="none"]').checked = true; // Устанавливаем стандартный фильтр

  // Валидация хэштегов
  formValidator.addValidator(
    hashtagsField,
    (value) => {
      const hashtags = value.trim().toLowerCase().split(' ');
      const hashtagPattern = /^#[A-Za-zА-Яа-я0-9]{2,19}$/;
      const uniqueHashtags = new Set(hashtags);
      return hashtags.every((tag) => hashtagPattern.test(tag)) && hashtags.length <= 5 && hashtags.length === uniqueHashtags.size;
    },
    'Некорректный формат хэштега или превышено количество'
  );

  // Валидация поля описания
  formValidator.addValidator(descriptionField, (value) => value.length <= 140, 'Длина описания не может превышать 140 символов');

  // Обработка отправки формы
  uploadFormElement.addEventListener('submit', async (evt) => {
    evt.preventDefault(); // Предотвращаем стандартное поведение браузера
    submitButton.disabled = true; // Блокируем кнопку отправки, чтобы предотвратить повторные клики

    const formData = new FormData(uploadFormElement); // Собираем данные из формы

    try {
      // Отправляем данные с помощью функции sendData
      await sendData(formData);
      showMessage('success'); // Показываем сообщение об успешной отправке

      // После успешной отправки добавляем фото в список и обновляем отображение
      const appliedFilter = getActiveFilterSettings(); // Получаем текущий фильтр
      const newImageUrl = URL.createObjectURL(fileInputElement.files[0]);

      const newImage = {
        id: imageCollection.length + 1, // Генерируем уникальный ID
        url: newImageUrl,
        description: descriptionField.value, // Берём описание из поля формы
        likes: 0,
        comments: [],
        effect: appliedFilter.effect,
        intensity: appliedFilter.intensity,
      };

      imageCollection.push(newImage); // Добавляем новое фото в коллекцию
      renderImageThumbnails([newImage]); // Обновляем отображение миниатюр

      resetForm(); // Сбрасываем форму после успешной отправки
    } catch (error) {
      showMessage('error'); // Показываем сообщение об ошибке
    } finally {
      submitButton.disabled = false; // Разблокируем кнопку отправки в любом случае
    }
  });

  // Применение выбранного фильтра
  function applyImageFilter(filter, intensity) {
    imagePreviewElement.className = '';
    imagePreviewElement.style.filter = '';

    if (filter !== 'none') {
      imagePreviewElement.classList.add(`effects__preview--${filter}`);
      switch (filter) {
        case 'chrome':
          imagePreviewElement.style.filter = `grayscale(${intensity / 100})`;
          break;
        case 'sepia':
          imagePreviewElement.style.filter = `sepia(${intensity / 100})`;
          break;
        case 'marvin':
          imagePreviewElement.style.filter = `invert(${intensity}%)`;
          break;
        case 'phobos':
          imagePreviewElement.style.filter = `blur(${(intensity / 100) * 3}px)`;
          break;
        case 'heat':
          imagePreviewElement.style.filter = `brightness(${1 + (intensity / 100) * 2})`;
          break;
      }
    }
  }

  // Обновление состояния слайдера при смене фильтра
  function updateFilterSlider(filter) {
    if (filter === 'none') {
      filterSlider.classList.add('hidden');
      sliderValueElement.value = '';
    } else {
      filterSlider.classList.remove('hidden');
      filterSlider.noUiSlider.updateOptions({
        range: { min: 0, max: 100 },
        start: 100,
      });
      sliderValueElement.value = 100;
    }
  }

  // Применение изменения эффекта
  filterRadios.forEach((radioButton) => {
    radioButton.addEventListener('change', (evt) => {
      activeFilter = evt.target.value;
      updateFilterSlider(activeFilter);
      applyImageFilter(activeFilter, filterSlider.noUiSlider.get());
    });
  });

  filterSlider.noUiSlider.on('update', (values) => {
    const value = Math.round(values[0]);
    sliderValueElement.value = value;
    applyImageFilter(activeFilter, value);
  });

  // Извлечение данных о текущем фильтре
  function getActiveFilterSettings() {
    const selectedFilter = Array.from(filterRadios).find((radio) => radio.checked)?.value || 'none';
    const filterIntensity = filterSlider.noUiSlider ? filterSlider.noUiSlider.get() : 100;

    return {
      effect: selectedFilter,
      intensity: selectedFilter === 'none' ? null : filterIntensity,
    };
  }

  // Масштабирование изображения
  function setupImageScalingControls() {
    const scaleValueField = document.querySelector('.scale__control--value');
    const scaleDownButton = document.querySelector('.scale__control--smaller');
    const scaleUpButton = document.querySelector('.scale__control--bigger');
    const SCALE_STEP = 25;
    const MIN_SCALE = 25;
    const MAX_SCALE = 100;

    const updateScale = (value) => {
      value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
      scaleValueField.value = `${value}%`;
      imagePreviewElement.style.transform = `scale(${value / 100})`;
    };

    scaleDownButton.addEventListener('click', () => {
      const currentScale = parseInt(scaleValueField.value, 10) - SCALE_STEP;
      updateScale(currentScale);
    });

    scaleUpButton.addEventListener('click', () => {
      const currentScale = parseInt(scaleValueField.value, 10) + SCALE_STEP;
      updateScale(currentScale);
    });

    updateScale(100);
  }
}

