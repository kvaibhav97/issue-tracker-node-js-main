/**
 * Uses Fetch API to send a PATCH request, which should update status property
 * of the issues resource. When request is fulfilled checks if response
 * is successful. For non successful requests shows alert. Otherwise it
 * current client location to show refreshed data.
 * @param {string} id Id of the issue for which status should be changed.
 * @param {string} status New value of the status.
 */
function patch(id, status) {
  fetch('/issues/' + id + '/status', {
    method: 'PATCH',
    body: JSON.stringify({
      status: status,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((res) => {
    if (!res.ok) {
      alert("Can't update issue to " + status + ' status!');
    } else {
      location.reload();
    }
  });
}

const assignButtons = document.getElementsByClassName(
  'issues__issue__card__action--assign'
);
const closeButtons = document.getElementsByClassName(
  'issues__issue__card__action--close'
);
const assignButtonsArr = Array.from(assignButtons);
const closeButtonsArr = Array.from(closeButtons);

assignButtonsArr.concat(closeButtonsArr).forEach((element) => {
  element.addEventListener('click', () =>
    patch(element.dataset.id, element.dataset.status)
  );
});
