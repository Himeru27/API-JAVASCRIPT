export const updateRoomTypeModal = async (roomTypeId, refreshDisplay) => {
  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  document.getElementById("blank-modal-title").innerText = "Update Room Type";

  const roomType = await getRoomTypeDetails(roomTypeId);

  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Room Type Name</td>
            <td>
              <input type="text" id="update-type-name" class="form-control" value="${roomType[0].room_type_name}" />
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td>
              <input type="text" id="update-description" class="form-control" value="${roomType[0].room_description}" />
            </td>
          </tr>
          <tr>
            <td>Room Rate</td>
            <td>
              <input type="number" id="update-rate" class="form-control" value="${roomType[0].room_rate}" />
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
    if (await updateRoomType(roomTypeId) == 1) {
      refreshDisplay();
      alert("Room Type has been successfully updated!");
      myModal.hide();
    } else {
      alert("ERROR!");
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

const updateRoomType = async (roomTypeId) => {
  const jsonData = {
    typeName: document.getElementById("update-type-name").value,
    description: document.getElementById("update-description").value,
    rate: document.getElementById("update-rate").value,
    roomTypeId: roomTypeId,
  };

  const formData = new FormData();
  formData.append("operation", "updateRoomType");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${sessionStorage.baseAPIUrl}/roomtype.php`,
    method: "POST",
    data: formData,
  });
  console.log(response.data);
  return response.data;
};
