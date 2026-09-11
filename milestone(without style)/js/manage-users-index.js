const baseApiUrl = "http://localhost/milestone1/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);
let roles = [];

document.addEventListener("DOMContentLoaded", () => {
  displayRolesDropdown();
  displayUsers();
  document.getElementById("btn-update").addEventListener("click", () => {
    updateUser();
  });
  document.getElementById("btn-cancel-update").addEventListener("click", () => {
    document.getElementById("edit-div").style.display = "none";
  });
});

const displayRolesDropdown = async () => {
  const select = document.getElementById("update-role");

  const response = await axios.get(`${baseApiUrl}/users.php`, {
    params: { operation: "getAllRoles" },
  });
  if (response.status == 200) {
    roles = response.data;
    roles.forEach((role) => {
      let option = document.createElement("option");
      option.innerText = role.role_type;
      option.value = role.role_id;
      select.appendChild(option);
    });
  } else {
    alert("Error!");
  }
};

const displayUsers = async () => {
  const response = await axios.get(`${baseApiUrl}/users.php`, {
    params: { operation: "getAllUsers" },
  });

  if (response.status == 200) {
    displayUsersTable(response.data);
  } else {
    alert("Error!");
  }
};

const displayUsersTable = (users) => {
  const tableDiv = document.getElementById("table-div");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>
        <th>USERNAME</th>
        <th>EMAIL</th>
        <th>ROLE</th>
        <th>STATUS</th>
        <th>CREATED AT</th>
        <th>ACTION</th>
      </tr>
    `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  users.forEach((user) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email ? user.email : ""}</td>
        <td>${user.role_type}</td>
        <td>${user.user_status}</td>
        <td>${user.createdAt}</td>
        <td>
          <button type='button' class='btn-update'>Update</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      showUpdateForm(user);
    });
  });
  table.appendChild(tbody);

  tableDiv.appendChild(table);
};

const showUpdateForm = (user) => {
  document.getElementById("edit-username-label").innerText = `Username: ${user.username}`;
  document.getElementById("update-role").value = user.role_id;
  document.getElementById("update-status").value = user.user_status;
  document.getElementById("update-user-id").value = user.user_id;
  document.getElementById("edit-div").style.display = "block";
};

const updateUser = async () => {
  const jsonData = {
    roleId: document.getElementById("update-role").value,
    userStatus: document.getElementById("update-status").value,
    userId: document.getElementById("update-user-id").value,
  };

  const formData = new FormData();
  formData.append("operation", "updateUser");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/users.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayUsers();
    document.getElementById("edit-div").style.display = "none";
    alert("User has been successfully updated!");
  } else {
    alert("ERROR!");
  }
};
