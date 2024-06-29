// ? Grab all the references to the DOM elements
const moodBoardEl = document.querySelector('#mood-board');
const addImageBtn = document.querySelector('#add-image');
const imageUrlInput = document.querySelector('#image-url');
const addTextBtn = document.querySelector('#add-text');
const textInput = document.querySelector('#text-input');
const clearBtn = document.querySelector('#clear-all');

// ? We need to keep track of the elements that are added to the mood board and their positions
let tempStorageObject = {
  images: [],
  text: [],
};

// ? We neet to keep track of the current element that is being dragged
let currentElement = null;

clearBtn.addEventListener('click', function () {
  // TODO: Clear the local storage and refresh the page
  // clear all inputs inside of the tempStorageObject
  tempStorageObject = {
    images: [],
    text: [],
  };

  //run update local storage to remove items. Reload the page
  updateLocalStorage();
  location.reload()
});

function updateLocalStorage() {
  // TODO: Update the local storage with the tempStorageObject
  console.log(tempStorageObject)
  localStorage.setItem('storedData', JSON.stringify(tempStorageObject))
}

// ? Function to load from local storage. This function will be called on page load.
function loadFromLocalStorage() {
  // TODO: Load and parse the data from local storage and paint the images and text on the mood board
  const storedData = JSON.parse(localStorage.getItem('storedData'));
  console.log(storedData)

  if (storedData) {
    tempStorageObject = storedData;

    // Paint the stored images on mood board
    tempStorageObject.images.forEach((image) => {
      const img = document.createElement('img');
      img.src = image.url;
      img.style.left = image.left;
      img.style.top = image.top;
      img.classList.add('draggable');
      moodBoardEl.appendChild(img);
    });

    // TODO: Paint the stored text to the mood board
    tempStorageObject.text.forEach((text) => {
      const tex = document.createElement('div');
      tex.textContent = text.text;
      // sets each inputs positon
      tex.style.left = text.left;
      tex.style.top = text.top;
      // makes the text draggable and appends to the board
      tex.classList.add('draggable')
      moodBoardEl.appendChild(tex);
    });

  }
};


//  ? We create an event listener for the image URL input field. This will create an image element and attach it to the mood board with the URL provided by the user.
addImageBtn.addEventListener('click', function () {
  const imageUrl = imageUrlInput.value;
  if (imageUrl) {
    // TODO: Create an image element, add a class of draggable, set the src attribute to the image URL provided by the user, and append it to the body element
    const imageDiv = document.createElement('img');
    imageDiv.classList.add('draggable');
    imageDiv.src = imageUrl;
    document.body.appendChild(imageDiv);
    
    // TODO: Set the `currentElement` to the image element you create.
    currentElement = imageDiv;

    // ? We attach the mouse move event listener to the document and the mood board div so that the element can be dragged anywhere on the screen and dropped only on the mood board div.
    attachMouseListeners();
  }
});

// ? We create an event listener for the text input field. This will create a div element and attach it to the mood board with the text provided by the user.
addTextBtn.addEventListener('click', function () {
  const text = textInput.value;
  if (text) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('text-item', 'draggable');
    textDiv.textContent = text;
    document.body.appendChild(textDiv);

    // ? We set the current element to the text div so that we can update the position of the element when the mouse is moved.
    currentElement = textDiv;

    // ? We attach the mouse move event listener to the document and the click listener to the mood board div so that the element can be dragged anywhere on the screen, but dropped only on the mood board div.
    attachMouseListeners();
  }
});

function attachMouseListeners() {
  // TODO: Attach the mouse move event listener to the document and the click listener to the mood board div so that the element can be dragged anywhere on the screen, but dropped only on the mood board div.
  document.addEventListener('mousemove', mouseMoveHandler)

  moodBoardEl.addEventListener('click', placeElementClickHandler)
}

// ? This is the event handler for the mouse move event. This will be called whenever the mouse is moved on the screen.
// ? We check if the current element is set. If it is set, we update the position of the element to the mouse position.
function mouseMoveHandler(event) {
  if (currentElement) {
    currentElement.style.left = event.clientX + 'px';
    currentElement.style.top = event.clientY + 'px';
  }
}

// ? This is the event handler for the click event on the mood board. This will be called whenever the user clicks on the mood board.
// ? We check if the current element is set. If it is set, we attach the element to the mood board and reset the current element.
// ? When we click, we find the position of the mouse relative to the mood board and update the position of the element accordingly. to 'place' it on the mood board.
function placeElementClickHandler(event) {
  if (currentElement) {
    // it grabs the x and y position of the moodboard and it's relative positition to the viewport
    const moodBoardRect = moodBoardEl.getBoundingClientRect();

    // it minuses the mouse x and y by the relative x and y of the mood board
    const left = `${event.clientX - moodBoardRect.left}px`;
    const top = `${event.clientY - moodBoardRect.top}px`;

    // ? Set the position of the element based on the calculated position above.
    currentElement.style.left = left;
    currentElement.style.top = top;

    // TODO: Explain why we remove the draggable class from the element
    currentElement.classList.remove('draggable');

    // ? Append the element to the mood board with the already calculated position.
    moodBoardEl.appendChild(currentElement);

    // TODO: Explain what the `tagName` property is used for
    if (currentElement.tagName === 'IMG') {
      // ? Push the image object to the tempStorageObject images property/array
      tempStorageObject.images.push({
        url: currentElement.src,
        left: left,
        top: top,
      });
    } else {
      // ? Push the text object to the tempStorageObject text property/array
      tempStorageObject.text.push({
        text: currentElement.textContent,
        left: left,
        top: top,
      });
    }

    // Update local storage with the new tempStorageObject information
    updateLocalStorage();

    // Reset current element
    currentElement = null;

    // Clear inputs
    imageUrlInput.value = '';
    textInput.value = '';

    // ? Remove event listeners for mouse move, so that the element is no longer draggable
    document.removeEventListener('mousemove', mouseMoveHandler);
  }
}

// ? Load existing data from local storage on page load
window.onload = loadFromLocalStorage;
