export const deleteRoomTypeModal = async (roomTypeId, refreshDisplay) => {
  document.getElementById("blank-modal-title").innerText = "Confirm Delete";

  const roomType = await getRoomTypeDetails(roomTypeId);
  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Room Type</td>
            <td>${roomType[0].room_type_name}</td>
          </tr>
          <tr>
            <td>Rate</td>
            <td>&#8369;${roomType[0].room_rate}</td>
          </tr>
        </table>
        <p class="text-muted small">
          This room type will be deactivated and hidden from selection lists.
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
    if (await deleteRecord(roomType[0].room_type_id) == 1) {
      refreshDisplay();
      alert("Room Type has been deactivated!");
      myModal.hide();
    } else {
      alert("ERROR");
    }
  });

  myModal.show();
};

const getRoomTypeDetails = async (roomTypeId) => {
  const params = {
    operation: "getRoomType",
    json: JSON.stringify({ roomTypeId: roomTypeId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/roomtype.php`,
    { params: params }
  );
  return response.data;
};

const deleteRecord = async (roomTypeId) => {
  const params = {
    operation: "deleteRoomType",
    json: JSON.stringify({ roomTypeId: roomTypeId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/roomtype.php`,
    { params: params }
  );
  console.log(response.data);
  return response.data;
};
