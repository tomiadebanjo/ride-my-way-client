const lgEmail = document.querySelector('#lg-email');
const lgPassword = document.querySelector('#lg-password');
const lgEmailError = document.querySelector('#lg-email-error');
const lgPasswordError = document.querySelector('#lg-password-error');
const lgSubmitButton = document.querySelector('#lg-submit-button');
const lgSuccessMessage = document.querySelector('#lg-api-success');
const lgErrorMessage = document.querySelector('#lg-api-error');
const lgSpinner = document.querySelector('#lg-spinner');

const validateInputLg = () => {
  /* Regex gotten from regexr.com */
  const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;

  if (!lgEmail.value) {
    lgEmailError.innerHTML = 'please enter a valid email address';
    return false;
  }
  if (!emailTest.test(lgEmail.value)) {
    lgEmailError.innerHTML = 'please enter a valid email address';
    return false;
  }
  lgEmail.addEventListener('keyup', () => {
    lgEmailError.innerHTML = '';
  });
  if (!lgPassword.value) {
    lgPasswordError.innerHTML = 'please enter a valid password';
    lgPassword.addEventListener('keyup', () => {
      lgPasswordError.innerHTML = '';
    });
    return false;
  }
  if (lgPassword.value.length < 8) {
    lgPasswordError.innerHTML = 'password must be at least 8 characters';
    lgPassword.addEventListener('keyup', () => {
      lgPasswordError.innerHTML = '';
    });
    return false;
  }
  if (!passwordTest.test(lgPassword.value)) {
    lgPasswordError.innerHTML = 'password should be at least one capital letter, one small letter, one number';
    lgPassword.addEventListener('keyup', () => {
      lgPasswordError.innerHTML = '';
    });
    return false;
  }
  return true;
};

lgSubmitButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (validateInputLg()) {
    lgErrorMessage.setAttribute('style', 'display: none');
    const url = 'https://ride-my-way-zaz.herokuapp.com/api/v1/auth/login';
    const userInfo = {
      email: lgEmail.value,
      password: lgPassword.value,
    };
    lgSpinner.setAttribute('style', 'display: block');
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    })
      .then(res => res.json())
      .then((data) => {
        setTimeout(() => {
          lgSpinner.setAttribute('style', 'display: none');
          if (data.success) {
            sessionStorage.token = data.token;
            sessionStorage.userId = data.userId;
            sessionStorage.fullName = data.fullName;
            lgSuccessMessage.setAttribute('style', 'display: block');
            lgSuccessMessage.innerHTML = `<i class="fa fa-check"></i> ${
              data.message
            } redirecting in 2 seconds`;
            setTimeout(() => {
              window.location = 'passenger-view.html';
            }, 2000);
          } else {
            lgErrorMessage.setAttribute('style', 'display: block');
            lgErrorMessage.innerHTML = `<i class="far fa-times-circle"></i> ${data.message} `;
          }
        }, 1000);
      })
      .catch(err => console.log(err));
  }
});
