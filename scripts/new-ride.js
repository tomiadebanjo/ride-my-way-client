const takeOff = document.querySelector('#take-off');
const destination = document.querySelector('#destination');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const takeOffError = document.querySelector('#takeoff-error');
const destinationError = document.querySelector('#destinaton-error');
const dateError = document.querySelector('#date-error');
const timeError = document.querySelector('#time-error');
const newSubmit = document.querySelector('#new-submit');
const newSuccessMessage = document.querySelector('#new-api-success');
const newErrorMessage = document.querySelector('#new-api-error');
const newSpinner = document.querySelector('#new-spinner');

const newValidate = () => {
  /* Regex gotten from regexr.com */
  const charTest = /[a-zA-Z]/g;
  const numTest = /[^a-zA-Z0-9/\s/-]/g;
  const timeTest = /^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/g;
  const dateTest = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

  if (!takeOff.value) {
    takeOffError.innerHTML = 'Please enter a valid takeoff location';
    takeOff.addEventListener('keyup', () => {
      takeOffError.innerHTML = '';
    });
    return false;
  }
  if (!charTest.test(takeOff.value)) {
    takeOffError.innerHTML = 'Enter a valid take off location';
    takeOff.addEventListener('keyup', () => {
      takeOffError.innerHTML = '';
    });
    return false;
  }
  if (numTest.test(takeOff.value)) {
    takeOffError.innerHTML = 'Enter a valid take off location';
    takeOff.addEventListener('keyup', () => {
      takeOffError.innerHTML = '';
    });
    return false;
  }
  takeOff.addEventListener('keyup', () => {
    takeOffError.innerHTML = '';
  });
  if (!destination.value) {
    destinationError.innerHTML = 'Please enter a valid destination';
    destination.addEventListener('keyup', () => {
      destinationError.innerHTML = '';
    });
    return false;
  }
  if (!charTest.test(destination.value)) {
    destinationError.innerHTML = 'Enter a valid destination';
    destination.addEventListener('keyup', () => {
      destinationError.innerHTML = '';
    });
    return false;
  }
  if (numTest.test(destination.value)) {
    destinationError.innerHTML = 'Enter a valid destinaiton';
    destination.addEventListener('keyup', () => {
      destinationError.innerHTML = '';
    });
    return false;
  }
  if (!date.value) {
    dateError.innerHTML = 'Please enter a valid date';
    date.addEventListener('keyup', () => {
      dateError.innerHTML = '';
    });
    return false;
  }
  if (!dateTest.test(date.value)) {
    dateError.innerHTML = 'Invalid Date format.. enter required format - dd/mm/yyyy e.g:- 10/05/2018';
    date.addEventListener('keyup', () => {
      dateError.innerHTML = '';
    });
    return false;
  }
  if (!time.value) {
    timeError.innerHTML = 'Please enter a valid time';
    time.addEventListener('keyup', () => {
      timeError.innerHTML = '';
    });
    return false;
  }
  if (!timeTest.test(time.value)) {
    timeError.innerHTML = 'Invalid time format.. enter required format - hh:mm e.g:- 16:40';
    time.addEventListener('keyup', () => {
      timeError.innerHTML = '';
    });
    return false;
  }
  return true;
};

// converts date format from dd/mm/yyyy to mm/dd/yyyy
const newDate = (olddate) => {
  const arr = olddate.split('/');
  const removed = arr.splice(1, 1);
  const newArr = removed.concat(arr);
  return newArr.join('/');
};

newSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  if (newValidate()) {
    newErrorMessage.setAttribute('style', 'display: none');
    const url = 'https://ride-my-way-zaz.herokuapp.com/api/v1/users/rides';
    const newRide = {
      destination: destination.value,
      pickUpLocation: takeOff.value,
      departureTime: time.value,
      departureDate: newDate(date.value),
    };
    newSpinner.setAttribute('style', 'display: block');
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.token,
      },
      body: JSON.stringify(newRide),
    })
      .then(res => res.json())
      .then((data) => {
        setTimeout(() => {
          newSpinner.setAttribute('style', 'display: none');
          if (data.success) {
            newSuccessMessage.setAttribute('style', 'display: block');
            newSuccessMessage.innerHTML = `<i class="fa fa-check"></i> ${data.message}`;
          } else {
            newErrorMessage.setAttribute('style', 'display: block');
            newErrorMessage.innerHTML = `<i class="far fa-times-circle"></i> ${
              data.message
            } .. Try Again`;
          }
        }, 1000);
      })
      .catch(err => console.log(err));
  }
});
