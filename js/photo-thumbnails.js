import { showFullView } from './big-picture.js';

const templateElement = document.querySelector('#picture').content.querySelector('.picture');

function generateThumbnail(photoInfo) {
  const thumbnailClone = templateElement.cloneNode(true);
  const imageElement = thumbnailClone.querySelector('.picture__img');
  imageElement.src = photoInfo.url;
  imageElement.alt = photoInfo.description;
  thumbnailClone.querySelector('.picture__likes').textContent = photoInfo.likes;
  thumbnailClone.querySelector('.picture__comments').textContent = photoInfo.comments.length;

  // Добавляем обработчик для открытия большого изображения
  thumbnailClone.addEventListener('click', () => {
    showFullView(photoInfo);
  });

  return thumbnailClone;
}

function displayThumbnails(photoList) {
  const container = document.querySelector('.pictures');

  photoList.forEach((photo) => {
    const thumbnailItem = generateThumbnail(photo);

    // Установка эффектов для миниатюры, если указано
    if (photo.effect && photo.effect !== 'none') {
      thumbnailItem.querySelector('.picture__img').classList.add(`effects__preview--${photo.effect}`);
    }

    container.appendChild(thumbnailItem);
  });
}

export { displayThumbnails };

