const signOut = document.querySelector('#sign-out');

signOut.addEventListener('click', (e) => {
e.preventDefault();
  delete sessionStorage.token;
  window.location.href = '../index.html';
});