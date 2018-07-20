const signOut = document.querySelector('#sign-out');

signOut.addEventListener('click', (e) => {
e.preventDefault();
  sessionStorage.clear();
  window.location.href = '../index.html';
});