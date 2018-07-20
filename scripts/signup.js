const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const firstNameError = document.querySelector('#first-name-error');
const lastNameError = document.querySelector('#last-name-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const submitButton = document.querySelector('#submit-button');
const successMessage = document.querySelector('#api-success');
const errorMessage = document.querySelector('#api-error');
const spinner = document.querySelector('#spinner');

const validateInput = () => {
  /* Regex gotten from regexr.com */
  const charTest = /[^a-zA-Z-]/g;
  const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  if (!firstName.value) {
    firstNameError.innerHTML = 'Please enter a valid first Name';
    firstName.addEventListener('keyup', () => {
      firstNameError.innerHTML = '';
    });
    return false;
  }
  if (charTest.test(firstName.value)) {
    firstNameError.innerHTML = 'first name can only contain letters';
    return false;
  }
  firstName.addEventListener('keyup', () => {
    firstNameError.innerHTML = '';
  });
  if (!lastName.value) {
    lastNameError.innerHTML = 'Please enter a valid last Name';
    lastName.addEventListener('keyup', () => {
      lastNameError.innerHTML = '';
    });
    return false;
  }
  if (charTest.test(lastName.value)) {
    lastNameError.innerHTML = 'last name can only contain letters';
    return false;
  }
  lastName.addEventListener('keyup', () => {
    lastNameError.innerHTML = '';
  });
  if (!email.value) {
    emailError.innerHTML = 'please enter a valid email address';
    return false;
  }
  if (!emailTest.test(email.value)) {
    emailError.innerHTML = 'please enter a valid email address';
    return false;
  }
  email.addEventListener('keyup', () => {
    emailError.innerHTML = '';
  });
  if (!password.value) {
    passwordError.innerHTML = 'please enter a valid password';
    password.addEventListener('keyup', () => {
      passwordError.innerHTML = '';
    });
    return false;
  }
  if (password.value.length < 8) {
    passwordError.innerHTML = 'password must be at least 8 characters';
    password.addEventListener('keyup', () => {
      passwordError.innerHTML = '';
    });
    return false;
  }
  if (!passwordTest.test(password.value)) {
    passwordError.innerHTML = 'password should be at least one capital letter, one small letter, one number';
    password.addEventListener('keyup', () => {
      passwordError.innerHTML = '';
    });
    return false;
  }
  return true;
};


submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (validateInput()) {
    errorMessage.setAttribute('style', 'display: none');
    const url = 'https://ride-my-way-zaz.herokuapp.com/api/v1/auth/signup';
    const newUser = {
      fullName: `${firstName.value} ${lastName.value}`,
      email: email.value,
      password: password.value,
    };
    spinner.setAttribute('style', 'display: block');
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(res => res.json())
      .then((data) => {
        setTimeout(() => {
          spinner.setAttribute('style', 'display: none');
          if (data.message === 'User registration successful') {
            sessionStorage.token = data.token;
            sessionStorage.userId = data.userId;
            sessionStorage.fullName = data.fullName;
            console.log(data);
            successMessage.setAttribute('style', 'display: block');
            successMessage.innerHTML = `<i class="fa fa-check"></i> ${data.message} redirecting in 2 seconds`;
            setTimeout(() => {
              window.location = 'passenger-view.html';
            }, 2000);
          } else {
            errorMessage.setAttribute('style', 'display: block');
            errorMessage.innerHTML = `<i class="far fa-times-circle"></i> ${data.message} `;
          }
        }, 1000);
      })
      .catch(err => console.log(err));
  }
});
