const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  displayRoomTypes();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertRoomType();
  });
  document.getElementById("btn-update").addEventListener("click", () => {
    updateRoomType();
  });
  document.getElementById("btn-cancel-update").addEventListener("click", () => {
    document.getElementById("edit-div").style.display = "none";
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
          <button type='button' class='btn-update'>Update</button>
          <button type='button' class='btn-delete'>Delete</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      showUpdateForm(roomType);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deleteRoomType(roomType.room_type_id);
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

const showUpdateForm = (roomType) => {
  document.getElementById("update-type-name").value = roomType.room_type_name;
  document.getElementById("update-description").value = roomType.room_description;
  document.getElementById("update-rate").value = roomType.room_rate;
  document.getElementById("update-room-type-id").value = roomType.room_type_id;
  document.getElementById("edit-div").style.display = "block";
};

const updateRoomType = async () => {
  const jsonData = {
    typeName: document.getElementById("update-type-name").value,
    description: document.getElementById("update-description").value,
    rate: document.getElementById("update-rate").value,
    roomTypeId: document.getElementById("update-room-type-id").value,
  };

  const formData = new FormData();
  formData.append("operation", "updateRoomType");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/roomtype.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayRoomTypes();
    document.getElementById("edit-div").style.display = "none";
    alert("Room Type has been successfully updated!");
  } else {
    alert("ERROR!");
  }
};

const deleteRoomType = async (roomTypeId) => {
  const params = {
    operation: "deleteRoomType",
    json: JSON.stringify({ roomTypeId: roomTypeId }),
  };
  const response = await axios.get(`${baseApiUrl}/roomtype.php`, {
    params: params,
  });

  if (response.data == 1) {
    displayRoomTypes();
    alert("Room Type has been deactivated!");
  } else {
    alert("ERROR");
  }
};
