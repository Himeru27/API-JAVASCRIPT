export const updateRoomModal = async (roomId, roomTypes, refreshDisplay) => {
  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  document.getElementById("blank-modal-title").innerText = "Update Room";

  const room = await getRoomDetails(roomId);

  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Room Number</td>
            <td>
              <input type="text" id="update-room-number" class="form-control" value="${room[0].room_number}" />
            </td>
          </tr>
          <tr>
            <td>Room Type</td>
            <td>
              ${createRoomTypeSelect(roomTypes, room[0].room_type_id)}
            </td>
          </tr>
        </table>
    `;
  document.getElementById("blank-main-div").innerHTML = myHtml;

  const modalFooter = document.getElementById("blank-modal-footer");
  myHtml = `
      <button type="button" class="btn btn-primary btn-sm w-100 btn-update">UPDATE</button>
      <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-dismiss="modal">Close</button>
    `;
  modalFooter.innerHTML = myHtml;

  modalFooter.querySelector(".btn-update").addEventListener("click", async () => {
    if (await updateRoom(roomId) == 1) {
      refreshDisplay();
      alert("Room has been successfully updated!");
      myModal.hide();
    } else {
      alert("ERROR!");
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

const createRoomTypeSelect = (roomTypes, roomTypeId) => {
  let myHtml = `<select id="update-room-type" class="form-select">`;

  roomTypes.forEach((roomType) => {
    let selected = roomTypeId == roomType.room_type_id ? "selected" : "";
    myHtml += `<option value="${roomType.room_type_id}" ${selected}>${roomType.room_type_name} (\u20B1${roomType.room_rate}/night)</option>`;
  });

  myHtml += "</select>";
  return myHtml;
};

const updateRoom = async (roomId) => {
  const jsonData = {
    roomNumber: document.getElementById("update-room-number").value,
    roomTypeId: document.getElementById("update-room-type").value,
    roomId: roomId,
  };

  const formData = new FormData();
  formData.append("operation", "updateRoom");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${sessionStorage.baseAPIUrl}/rooms.php`,
    method: "POST",
    data: formData,
  });
  console.log(response.data);
  return response.data;
};
