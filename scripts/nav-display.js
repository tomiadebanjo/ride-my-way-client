const signedIn = document.querySelector('#signed-in');
const signedIn1 = document.querySelector('.signed-in1');
const signedOut = document.querySelector('#signed-out');
const signedOut1 = document.querySelector('#signed-out1');

let authStatus;
if (sessionStorage.isAuthenticated) {
  authStatus = JSON.parse(sessionStorage.isAuthenticated);
}

if (!authStatus) {
  signedOut.setAttribute('style', 'display: block');
  signedOut1.setAttribute('style', 'display: block');
  signedIn.setAttribute('style', 'display: none');
  signedIn1.setAttribute('style', 'display: none');
} else {
  signedIn.setAttribute('style', 'display: block');
  signedIn1.setAttribute('style', 'display: block');
  signedOut.setAttribute('style', 'display: none');
  signedOut1.setAttribute('style', 'display: none');
}
