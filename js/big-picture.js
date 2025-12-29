const fullViewContainer = document.querySelector('.big-picture');
const fullViewImage = fullViewContainer.querySelector('.big-picture__img img');
const likeCounter = fullViewContainer.querySelector('.likes-count');
const commentCounter = fullViewContainer.querySelector('.comments-count');
const commentList = fullViewContainer.querySelector('.social__comments');
const imageDescription = fullViewContainer.querySelector('.social__caption');
const commentStatusBlock = fullViewContainer.querySelector('.social__comment-count');
const loadMoreButton = fullViewContainer.querySelector('.comments-loader');
const closeButton = fullViewContainer.querySelector('.big-picture__cancel');
const MAX_COMMENTS_PER_BATCH = 5;

let totalComments = [];
let loadedCommentCount = 0;

function createCommentElement(comment) {
  const listItem = document.createElement('li');
  listItem.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  listItem.appendChild(img);
  listItem.appendChild(text);

  return listItem;
}

function displayComments() {
  const newComments = totalComments.slice(loadedCommentCount, loadedCommentCount + MAX_COMMENTS_PER_BATCH);

  newComments.forEach((comment) => {
    const listItem = createCommentElement(comment);
    commentList.appendChild(listItem);
  });

  loadedCommentCount += newComments.length;

  commentStatusBlock.textContent = `${loadedCommentCount} из ${totalComments.length} комментариев`;

  if (loadedCommentCount >= totalComments.length) {
    loadMoreButton.classList.add('hidden');
  }
}

function showFullView(photoData) {
  fullViewImage.src = photoData.url;
  fullViewImage.alt = photoData.description;
  likeCounter.textContent = String(photoData.likes);
  commentCounter.textContent = String(photoData.comments.length);
  imageDescription.textContent = photoData.description;

  commentList.innerHTML = '';
  fullViewImage.className = '';

  // Применяем эффект, если указан
  if (photoData.effect && photoData.effect !== 'none') {
    fullViewImage.classList.add(`effects__preview--${photoData.effect}`);
  }

  totalComments = photoData.comments;
  loadedCommentCount = 0;

  displayComments();

  if (totalComments.length > 0) {
    commentStatusBlock.classList.remove('hidden');
    if (totalComments.length > MAX_COMMENTS_PER_BATCH) {
      loadMoreButton.classList.remove('hidden');
    } else {
      loadMoreButton.classList.add('hidden');
    }
  } else {
    commentStatusBlock.classList.add('hidden');
    loadMoreButton.classList.add('hidden');
  }

  fullViewContainer.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', hideFullView);
  document.addEventListener('keydown', handleEscapePress);
}

function hideFullView() {
  fullViewContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', hideFullView);
  document.removeEventListener('keydown', handleEscapePress);
}

function handleEscapePress(event) {
  if (event.key === 'Escape') {
    hideFullView();
  }
}

loadMoreButton.addEventListener('click', displayComments);

export { showFullView };

