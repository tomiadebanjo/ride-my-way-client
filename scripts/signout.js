const signOut = document.querySelector('#sign-out');

signOut.addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.clear();
  sessionStorage.isAuthenticated = JSON.stringify(false);
  window.location.href = window.location.pathname.includes('index.html') ? 'index.html' : '../index.html';
});
