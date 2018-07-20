const allRidesError = document.querySelector('#ride-error');
const rideTable = document.querySelector('#ride-table');
const modalTable = document.querySelector('#single-table');
const rideSpinner = document.querySelector('#ride-spinner');
const modalSpinner = document.querySelector('#modal-spinner');
const modal = document.querySelector('#myModal');
const span = document.querySelector('#ride-close');
const sucMessage = document.querySelector('#ride-api-success');
const errMessage = document.querySelector('#ride-api-error');

// trim and reverse Date gotten from api function
const trimDate = trim => trim
  .slice(0, 10)
  .split('-')
  .reverse()
  .join('-');

// trim time gotten from api function
const trimTime = trim => trim.slice(0, 5);

rideSpinner.setAttribute('style', 'display: block');
let rideInfo = '';
fetch('https://ride-my-way-zaz.herokuapp.com/api/v1/rides', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: sessionStorage.token,
  },
})
  .then(res => res.json())
  .then((data) => {
    setTimeout(() => {
      rideSpinner.setAttribute('style', 'display: none');
      if (data.success) {
        if (data.rides.length < 1) {
          allRidesError.setAttribute('style', 'display: block');
          allRidesError.innerHTML = '<i class="far fa-times-circle"></i> No available ride at this moment, check back later';
        } else {
          rideInfo = `<tr class="row">
                        <th>Take-off location</th>
                        <th>Destination</th>
                        <th>Departure time</th>
                        <th>Departure date</th>
                        <th>Details</th>
                    </tr >`;
          data.rides.forEach((ride) => {
            console.log(ride);
            const newDate = trimDate(ride.departure_date);
            const newTime = trimTime(ride.departure_time);
            rideInfo += ` <tr class="row">
                            <td>${ride.pickup_location}</td>
                            <td>${ride.destination}</td>
                            <td>${newTime}</td>
                            <td>${newDate}</td>
                            <td>
                                <button class="btn-light" onclick="rideDetails(${
  ride.id
})">View ride details / Request ride</button>
                            </td>
                    </tr>`;
            rideTable.innerHTML = rideInfo;
          });
        }
      }
    }, 1000);
  })
  .catch(err => console.log(err));

// Get details for a specific ride offer
const rideDetails = (rideId) => {
  let singleRideInfo = '';
  modal.style.display = 'block';
  modalTable.innerHTML = '';
  errMessage.setAttribute('style', 'display: none');
  sucMessage.setAttribute('style', 'display: none');
  modalSpinner.setAttribute('style', 'display: block');
  span.onclick = () => {
    modal.style.display = 'none';
  };
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
  const url = `https://ride-my-way-zaz.herokuapp.com/api/v1/rides/${rideId}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionStorage.token,
    },
  })
    .then(res => res.json())
    .then((data) => {
      setTimeout(() => {
        modalSpinner.setAttribute('style', 'display: none');
        if (data.success) {
          const trimmedDate = trimDate(data.rideDetails.departure_date);
          const trimmedTime = trimTime(data.rideDetails.departure_time);
          console.log(data);
          singleRideInfo = `
            <table class="table">
              <tr class="row">
                <th>Driver name</th>
                <td>${data.rideDetails.fullname}</td>
              </tr>
              <tr class="row">
                <th>Take-off Location</th>
                <td>${data.rideDetails.pickup_location}</td>
              </tr>
              <tr class="row">
                <th>Destination</th>
                <td>${data.rideDetails.destination}</td>
              </tr>
              <tr class="row">
                <th>Departure Date</th>
                <td>${trimmedDate}</td>
              </tr>
              <tr class="row">
                <th>Departure Time</th>
                <td>${trimmedTime}</td>
              </tr>
            </table>
            <div class="loader" id="ri-spinner"></div>
            <button class="modal-btn" onclick="joinRide(${rideId})">REQUEST TO JOIN RIDE</button>
          `;
          modalTable.innerHTML = singleRideInfo;
        }
      }, 1000);
    });
};

// Request to join ride
const joinRide = (rideId) => {
  const rideSpinner = document.querySelector('#ri-spinner');
  rideSpinner.setAttribute('style', 'display: block');
  const joinUrl = `https://ride-my-way-zaz.herokuapp.com/api/v1/rides/${rideId}/requests`;
  fetch(joinUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionStorage.token,
    },
  })
    .then(res => res.json())
    .then((data) => {
      setTimeout(() => {
        rideSpinner.setAttribute('style', 'display: none');
        console.log(data);
        if (data.success) {
          sucMessage.setAttribute('style', 'display: block');
          sucMessage.innerHTML = `<i class="fa fa-check"></i> ${data.message}`;
        } else {
          errMessage.setAttribute('style', 'display: block');
          errMessage.innerHTML = `<i class="far fa-times-circle"></i> ${data.message}`;
        }
      }, 1000);
      console.log(data);
    });
};
