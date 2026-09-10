export const deleteRoomModal = async (roomId, refreshDisplay) => {
  document.getElementById("blank-modal-title").innerText = "Confirm Delete";

  const room = await getRoomDetails(roomId);
  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Room Number</td>
            <td>${room[0].room_number}</td>
          </tr>
          <tr>
            <td>Room Type</td>
            <td>${room[0].room_type_name}</td>
          </tr>
        </table>
        <p class="text-muted small">
          This room will be deactivated and hidden from selection lists.
          It will not be permanently removed, so past bookings and bills that
          reference it will remain valid.
        </p>
    `;
  document.getElementById("blank-main-div").innerHTML = myHtml;

  const modalFooter = document.getElementById("blank-modal-footer");
  myHtml = `
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-danger btn-sm w-100 me-2 btn-delete">Deactivate</button>
        <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-dismiss="modal">Close</button>
      </div>
   `;
  modalFooter.innerHTML = myHtml;

  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  modalFooter.querySelector(".btn-delete").addEventListener("click", async () => {
    if (await deleteRecord(room[0].room_id) == 1) {
      refreshDisplay();
      alert("Room has been deactivated!");
      myModal.hide();
    } else {
      alert("ERROR");
    }
  });

  myModal.show();
};

const getRoomDetails = async (roomId) => {
  const params = {
    operation: "getRoom",
    json: JSON.stringify({ roomId: roomId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/rooms.php`,
    { params: params }
  );
  return response.data;
};

const deleteRecord = async (roomId) => {
  const params = {
    operation: "deleteRoom",
    json: JSON.stringify({ roomId: roomId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/rooms.php`,
    { params: params }
  );
  console.log(response.data);
  return response.data;
};
