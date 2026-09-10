import { updateRoomModal } from "./modules/update-room.js";
import { deleteRoomModal } from "./modules/delete-room.js";

const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);
let roomTypes = [];

document.addEventListener("DOMContentLoaded", () => {
  displayRoomTypesDropdown();
  displayRooms();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertRoom();
  });
});

const displayRoomTypesDropdown = async () => {
  const select = document.getElementById("room-type");

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
  table.classList.add("table", "table-hover", "table-striped", "table-sm");

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
          <button type='button' class='btn btn-success btn-sm btn-update'>Update</button>
          <button type='button' class='btn btn-danger btn-sm btn-delete'>Delete</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      updateRoomModal(room.room_id, roomTypes, displayRooms);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deleteRoomModal(room.room_id, displayRooms);
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
