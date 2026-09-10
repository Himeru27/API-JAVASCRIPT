import { updateRoomTypeModal } from "./modules/update-room-type.js";
import { deleteRoomTypeModal } from "./modules/delete-room-type.js";

const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  displayRoomTypes();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertRoomType();
  });
});

const displayRoomTypes = async () => {
  const response = await axios.get(`${baseApiUrl}/roomtype.php`, {
    params: { operation: "getAllRoomTypes" },
  });

  if (response.status == 200) {
    displayRoomTypesTable(response.data);
  } else {
    alert("Error!");
  }
};

const displayRoomTypesTable = (roomTypes) => {
  const tableDiv = document.getElementById("table-div");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("table", "table-hover", "table-striped", "table-sm");

  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>
        <th>ROOM TYPE</th>
        <th>DESCRIPTION</th>
        <th>RATE</th>
        <th>ACTION</th>
      </tr>
    `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  roomTypes.forEach((roomType) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${roomType.room_type_name}</td>
        <td>${roomType.room_description}</td>
        <td>&#8369;${roomType.room_rate}</td>
        <td>
          <button type='button' class='btn btn-success btn-sm btn-update'>Update</button>
          <button type='button' class='btn btn-danger btn-sm btn-delete'>Delete</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      updateRoomTypeModal(roomType.room_type_id, displayRoomTypes);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deleteRoomTypeModal(roomType.room_type_id, displayRoomTypes);
    });
  });
  table.appendChild(tbody);

  tableDiv.appendChild(table);
};

const insertRoomType = async () => {
  const jsonData = {
    typeName: document.getElementById("type-name").value,
    description: document.getElementById("description").value,
    rate: document.getElementById("rate").value,
  };

  const formData = new FormData();
  formData.append("operation", "insertRoomType");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/roomtype.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayRoomTypes();
    document.getElementById("type-name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("rate").value = "";
    alert("Room Type Successfully saved!");
  } else {
    alert("ERROR");
  }
};
