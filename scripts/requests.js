const reqError = document.querySelector('#view-ride-error');
const reqTable = document.querySelector('#view-table');
const reqModalTable = document.querySelector('#view-single-table');
const reqSpinner = document.querySelector('#view-spinner');
const reqModalSpinner = document.querySelector('#request-spinner');
const reqModal = document.querySelector('#viewModal');
const reqSpan = document.querySelector('#view-close');
const reqSucMessage = document.querySelector('#view-api-success');
const reqErrMessage = document.querySelector('#view-api-error');

// trim and reverse Date gotten from api function
const trimDate = trim => trim
  .slice(0, 10)
  .split('-')
  .reverse()
  .join('-');

// trim time gotten from api function
const trimTime = trim => trim.slice(0, 5);

reqSpinner.setAttribute('style', 'display: block');
let rideStatus = '';
const usersId = Number(sessionStorage.userId);

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
      reqSpinner.setAttribute('style', 'display: none');
      if (data.success) {
        const requestData = data.rides.filter(ride => ride.userid === usersId);
        if (data.rides.length < 1) {
          reqError.setAttribute('style', 'display: block');
          reqError.innerHTML = '<i class="far fa-times-circle"></i> No available ride at this moment, check back later';
        } else if (requestData.length < 1) {
          reqError.setAttribute('style', 'display: block');
          reqError.innerHTML = '<i class="far fa-times-circle"></i> You havent offered a ride yet !! Offer a ride to view ride status';
        } else {
          rideStatus = `<tr class="row">
                        <th>Take-off location</th>
                        <th>Destination</th>
                        <th>Departure time</th>
                        <th>Departure date</th>
                        <th>Details</th>
                    </tr >`;
          requestData.forEach((ride) => {
            const newDate = trimDate(ride.departure_date);
            const newTime = trimTime(ride.departure_time);
            rideStatus += ` <tr class="row">
                            <td>${ride.pickup_location}</td>
                            <td>${ride.destination}</td>
                            <td>${newTime}</td>
                            <td>${newDate}</td>
                            <td>
                                <button class="btn-light" onclick="getRideRequests(${ride.id})">
View ride requests</button>
                            </td>
                    </tr>`;
            reqTable.innerHTML = rideStatus;
          });
        }
      }
    }, 1000);
  })
  .catch(err => console.log(err));

// Get details for a specific ride offer
const getRideRequests = (rideId) => {
  let singleRideInfo = '';
  reqModal.style.display = 'block';
  reqModalTable.innerHTML = '';
  reqErrMessage.setAttribute('style', 'display: none');
  reqSucMessage.setAttribute('style', 'display: none');
  reqModalSpinner.setAttribute('style', 'display: block');
  reqSpan.onclick = () => {
    reqModal.style.display = 'none';
  };
  window.onclick = (event) => {
    if (event.target == reqModal) {
      reqModal.style.display = 'none';
    }
  };
  const url = `https://ride-my-way-zaz.herokuapp.com/api/v1/users/rides/${rideId}/requests`;
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
        reqModalSpinner.setAttribute('style', 'display: none');
        if (data.success) {
          singleRideInfo = `
              <tr class="row">
                <th>Rider name</th>
                <th>Request status</th>
                <th>Response</th>
              </tr>`;
          data.requests.forEach((request) => {
            const requestId = request.requestid;
            const rideId = request.rideid;
            singleRideInfo += `
                <tr class="row">
                    <td>${request.full_name}</td>
                    <td>${request.request_status}</td>
                    <td>
                        <button class="btn-light btn-accept" onclick="requestResponse(${rideId},${requestId},'accepted')">Accept</button>
                        <button class="btn-light btn-reject" onclick="requestResponse(${rideId},${requestId},'rejected')">Reject</button>
                    </td>
              </tr>`;
          });
          reqModalTable.innerHTML = singleRideInfo;
        } else {
          reqErrMessage.setAttribute('style', 'display: block');
          reqErrMessage.innerHTML = '<i class="far fa-times-circle"></i> No requests found for this ride. Check back later';
        }
      }, 1000);
    });
};

const requestResponse = (rideId, requestId, response) => {
  const url = `https://ride-my-way-zaz.herokuapp.com/api/v1/users/rides/${rideId}/requests/${requestId}`;
  const resReq = { response };
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionStorage.token,
    },
    body: JSON.stringify(resReq),
  })
    .then(res => res.json())
    .then((data) => {
      if (data.success) {
        setTimeout(() => {
          getRideRequests(rideId);
        }, 1000);
      }
    });
};
