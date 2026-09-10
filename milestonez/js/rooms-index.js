const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);
let roomTypes = [];

document.addEventListener("DOMContentLoaded", () => {
  displayRoomTypesDropdown("room-type");
  displayRoomTypesDropdown("update-room-type");
  displayRooms();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertRoom();
  });
  document.getElementById("btn-update").addEventListener("click", () => {
    updateRoom();
  });
  document.getElementById("btn-cancel-update").addEventListener("click", () => {
    document.getElementById("edit-div").style.display = "none";
  });
});

const displayRoomTypesDropdown = async (selectId = "room-type") => {
  const select = document.getElementById(selectId);

  const response = await axios.get(`${baseApiUrl}/roomtype.php`, {
    params: { operation: "getAllRoomTypes" },
  });
  if (response.status == 200) {
    roomTypes = response.data;
    roomTypes.forEach((roomType) => {
      let option = document.createElement("option");
      option.innerText = `${roomType.room_type_name} (\u20B1${roomType.room_rate}/night)`;
      option.value = roomType.room_type_id;
      select.appendChild(option);
    });
  } else {
    alert("Error!");
  }
};

const displayRooms = async () => {
  const response = await axios.get(`${baseApiUrl}/rooms.php`, {
    params: { operation: "getAllRooms" },
  });

  if (response.status == 200) {
    displayRoomsTable(response.data);
  } else {
    alert("Error!");
  }
};

const displayRoomsTable = (rooms) => {
  const tableDiv = document.getElementById("table-div");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>
        <th>ROOM NUMBER</th>
        <th>ROOM TYPE</th>
        <th>RATE</th>
        <th>ACTION</th>
      </tr>
    `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rooms.forEach((room) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${room.room_number}</td>
        <td>${room.room_type_name}</td>
        <td>&#8369;${room.room_rate}</td>
        <td>
          <button type='button' class='btn-update'>Update</button>
          <button type='button' class='btn-delete'>Delete</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      showUpdateForm(room);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deleteRoom(room.room_id);
    });
  });
  table.appendChild(tbody);

  tableDiv.appendChild(table);
};

const insertRoom = async () => {
  const jsonData = {
    roomNumber: document.getElementById("room-number").value,
    roomTypeId: document.getElementById("room-type").value,
  };

  const formData = new FormData();
  formData.append("operation", "insertRoom");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/rooms.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayRooms();
    document.getElementById("room-number").value = "";
    alert("Room Successfully saved!");
  } else {
    alert("ERROR");
  }
};

const showUpdateForm = (room) => {
  document.getElementById("update-room-number").value = room.room_number;
  document.getElementById("update-room-type").value = room.room_type_id;
  document.getElementById("update-room-id").value = room.room_id;
  document.getElementById("edit-div").style.display = "block";
};

const updateRoom = async () => {
  const jsonData = {
    roomNumber: document.getElementById("update-room-number").value,
    roomTypeId: document.getElementById("update-room-type").value,
    roomId: document.getElementById("update-room-id").value,
  };

  const formData = new FormData();
  formData.append("operation", "updateRoom");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/rooms.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayRooms();
    document.getElementById("edit-div").style.display = "none";
    alert("Room has been successfully updated!");
  } else {
    alert("ERROR!");
  }
};

const deleteRoom = async (roomId) => {
  const params = {
    operation: "deleteRoom",
    json: JSON.stringify({ roomId: roomId }),
  };
  const response = await axios.get(`${baseApiUrl}/rooms.php`, {
    params: params,
  });

  if (response.data == 1) {
    displayRooms();
    alert("Room has been deactivated!");
  } else {
    alert("ERROR");
  }
};
