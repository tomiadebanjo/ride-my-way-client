const allRidesError = document.querySelector('#ride-error');
const rideTable = document.querySelector('#ride-table');
const modalTable = document.querySelector('#single-table');
const rideSpinner = document.querySelector('#ride-spinner');
const modalSpinner = document.querySelector('#modal-spinner');
const modal = document.getElementById('myModal');
const span = document.getElementById('ride-close');

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
            rideInfo += ` <tr class="row">
                            <td>${ride.pickup_location}</td>
                            <td>${ride.destination}</td>
                            <td>${ride.departure_time}</td>
                            <td>${ride.departure_date}</td>
                            <td>
                                <button class="btn-light" onclick="rideDetails(${ride.id})">View ride details / Request ride</button>
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
          console.log(data);
          singleRideInfo = `
            <table class="table">
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
                <td>${data.rideDetails.departure_date}</td>
              </tr>
              <tr class="row">
                <th>Departure Time</th>
                <td>${data.rideDetails.departure_time}</td>
              </tr>
            </table>
            <button class="modal-btn">REQUEST TO JOIN RIDE</button>
          `;
          modalTable.innerHTML = singleRideInfo;
        }
      }, 1000);
    });
};
