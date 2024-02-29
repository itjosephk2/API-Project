//  declaring constants for api interaction
const API_KEY = 'E7y1fOltKvghwPgO8z7jSsq382g';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
// storing the bootstrap modal in a variable
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

// event listeners for buttons
document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

/**
* Process the ooptions intro csv format
*/
function processOptions(form) {
  // Empty array
  let optArray = [];
  // Itterate the entries
  for (let entry of form.entries()) {
    if (entry[0] === "options") {
      optArray.push(entry[1]);
    }
  }
  // Array Editing
  form.delete('options');
  form.append('options', optArray.join())
  return form;
}

/**
* Post data to the API
*/
async function postForm(e) {
  // Form element to variable
  const FORM = processOptions(new FormData(document.getElementById('checksform')));
  // Stes the method, header and body
  const RESPONSE = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
    },
    body: FORM,
  });
  // Awaits formatting the data into a JSON like format
  const DATA = await RESPONSE.json();
  if (RESPONSE.ok) {
    displayErrors(DATA);
  }
   // Catch the errors
  else {
    // Display error on screen
    displayException(DATA);
    // Print error to console and stop program
    throw new Error(DATA.error);
  }
}

/**
* 1. Makes a GET request to the API URL with the API api_key
* 2. Pass the data to a display function
*/
async function getStatus(e) {
  // creates a const for the full URL & API key
  const QUERYSTRING = `${API_URL}?api_key=${API_KEY}`;
  // Awaits the fetching of the API call and storesit in a variable
  const RESPONSE = await fetch(QUERYSTRING);
  // Awaits formatting the data into a JSON like format
  const DATA = await RESPONSE.json();
  // Display respionse to the screen
  if (RESPONSE.ok) {
    displayStatus(DATA.expiry);
  }
   // Catch the errors
  else {
    // Display error on screen
    displayException(DATA);
    // Print error to console and stop program
    throw new Error(DATA.error);
  }
}


/**
* Display status in a modal
*/
function displayStatus(expiry) {
  // setting elements to constants
  const modalTitle = document.getElementById('resultsModalTitle');
  const modalContent = document.getElementById('results-content');
  //setting html content to variables
  let modalTitleHtml = 'API Key Status';
  let modalContentHtml = '<p>Your key is valid until</p>' + '<p>' + expiry + '</p>';
  // Assigning html content to the selected elements
  modalTitle.innerHTML = modalTitleHtml;
  modalContent.innerHTML = modalContentHtml
  // Displays the modal
  resultsModal.show();
}

/**
* display errors to the screen
*/
function displayErrors(data) {
  // setting elements to constants
  const modalTitle = document.getElementById('resultsModalTitle');
  const modalContent = document.getElementById('results-content');

  // set html content
  // heading html
  let heading = 'JSHint Results for ' + data.file;
  //content html
  if (data.total_erros === 0) {
    results = '<div class="no-errors">No errors reported!</div>';
  }
  else {
    results = '<div class="errors">Total errors: <span class="error_count">' + data.total_erros + '</span></div>';
    for (let error of data.error_list) {
      results += '<div>At line <span class="line">' + error.line + '</span>';
      results += 'column<span class="column">' + error.col + '</span>';
      results += '<div class="error">' + error.error + '</div>';
    }
  }
  modalTitle.innerHTML = heading;
  modalContent.innerHTML = results;
  // Displays the modal
  resultsModal.show();
}

/**
* display errors to the screen
*/
function displayException(data) {
  // setting elements to constants
  const modalTitle = document.getElementById('resultsModalTitle');
  const modalContent = document.getElementById('results-content');
  // set html content
  // heading html
  let heading = 'An Exception Occured';
  //content html
  let results = '<p>The API returned status code ' + data.status_code + '</p>';
  results += '<p>Error number: <strong>' + data.error_no + '</strong></p>';
  results += '<p>Error text: <strong>' + data.error + '</strong></p>';
  // Ading content to modal elements
  modalTitle.innerHTML = heading;
  modalContent.innerHTML = results;
  // Displays the modal
  resultsModal.show();
}
