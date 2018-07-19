if (!sessionStorage.token) {
  alert('Please login to access this page');
  window.location.href = '../index.html';
}
const url = 'https://ride-my-way-zaz.herokuapp.com/api/v1/rides';
fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: sessionStorage.token,
  },
})
  .then(res => res.json())
  .then((data) => {
    if (data.auth === false) {
      window.location.href = '../index.html';
      alert('Session expired! Login again!');
    }
  })
  .catch(err => console.log(err));
