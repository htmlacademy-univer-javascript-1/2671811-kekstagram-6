import { getData } from './photo-api.js';
import { displayThumbnails } from './photo-thumbnails.js';
import { initForm } from './form-init.js';

const photosArray = [];
const DEBOUNCE_DELAY = 500; // Задержка для оптимизации фильтрации
const RANDOM_PHOTO_COUNT = 10; // Количество случайных изображений
const filtersSection = document.querySelector('.img-filters'); // Блок фильтров
const imagesContainer = document.querySelector('.pictures'); // Контейнер для картинок
const filtersWrapper = document.querySelector('.img-filters');
let allPhotos = []; // Массив всех фотографий
let filteredImages = []; // Массив отфильтрованных изображений

// Функция для создания задержки (debounce)
const debounceFunction = (callback, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

// Получение случайных фотографий
const getRandomImages = (photos) => {
  const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
  return shuffledPhotos.slice(0, RANDOM_PHOTO_COUNT);
};

// Получение самых популярных фотографий по количеству комментариев
const getMostDiscussedImages = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

// Функция для очистки старых фотографий
const clearImages = () => {
  imagesContainer.querySelectorAll('.picture').forEach((photo) => photo.remove());
};

// Обработка фильтрации фотографий
const handleFilterChange = debounceFunction((filter) => {
  clearImages(); // Удаляем старые фотографии

  switch (filter) {
    case 'filter-default':
      filteredImages = allPhotos; // Отображаем фотографии по умолчанию
      break;
    case 'filter-random':
      filteredImages = getRandomImages(allPhotos); // Отображаем случайные фотографии
      break;
    case 'filter-discussed':
      filteredImages = getMostDiscussedImages(allPhotos); // Отображаем самые обсуждаемые
      break;
  }

  displayThumbnails(filteredImages); // Рендерим отфильтрованные изображения
}, DEBOUNCE_DELAY);

// Инициализация фильтров
const initializeFilters = () => {
  filtersSection.classList.remove('img-filters--inactive'); // Показываем фильтры

  filtersSection.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('img-filters__button')) {
      // Убираем активный класс с предыдущей кнопки
      filtersSection.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      // Добавляем активный класс нажатой кнопке
      evt.target.classList.add('img-filters__button--active');
      // Вызываем функцию фильтрации
      handleFilterChange(evt.target.id);
    }
  });
};

// Загрузка фотографий с сервера
const loadImages = async () => {
  try {
    allPhotos = await getData(); // Загружаем фотографии с сервера
    filteredImages = allPhotos; // По умолчанию отображаем все фотографии
    filtersWrapper.classList.remove('img-filters--inactive'); // Показываем блок фильтров
    initializeFilters(); // Инициализируем фильтры
    displayThumbnails(filteredImages); // Отображаем изображения на странице
  } catch (error) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Не удалось загрузить изображения. Пожалуйста, попробуйте позже.';
    errorMessage.style.cssText = `
      color: red;
      text-align: center;
      font-size: 20px;
      margin-top: 20px;
    `;
    document.body.appendChild(errorMessage);
  }
};

// Загружаем изображения при старте
loadImages();

// Инициализируем форму редактирования
initForm(photosArray, displayThumbnails);

