const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  displayPaymentTypes();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertPaymentType();
  });
  document.getElementById("btn-update").addEventListener("click", () => {
    updatePaymentType();
  });
  document.getElementById("btn-cancel-update").addEventListener("click", () => {
    document.getElementById("edit-div").style.display = "none";
  });
});

const displayPaymentTypes = async () => {
  const response = await axios.get(`${baseApiUrl}/paymenttype.php`, {
    params: { operation: "getAllPaymentTypes" },
  });

  if (response.status == 200) {
    displayPaymentTypesTable(response.data);
  } else {
    alert("Error!");
  }
};

const displayPaymentTypesTable = (paymentTypes) => {
  const tableDiv = document.getElementById("table-div");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>
        <th>PAYMENT TYPE</th>
        <th>ACTION</th>
      </tr>
    `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  paymentTypes.forEach((paymentType) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${paymentType.payment_type_name}</td>
        <td>
          <button type='button' class='btn-update'>Update</button>
          <button type='button' class='btn-delete'>Delete</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      showUpdateForm(paymentType);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deletePaymentType(paymentType.payment_type_id);
    });
  });
  table.appendChild(tbody);

  tableDiv.appendChild(table);
};

const insertPaymentType = async () => {
  const jsonData = {
    typeName: document.getElementById("type-name").value,
  };

  const formData = new FormData();
  formData.append("operation", "insertPaymentType");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/paymenttype.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayPaymentTypes();
    document.getElementById("type-name").value = "";
    alert("Payment Type Successfully saved!");
  } else {
    alert("ERROR");
  }
};

const showUpdateForm = (paymentType) => {
  document.getElementById("update-type-name").value = paymentType.payment_type_name;
  document.getElementById("update-payment-type-id").value = paymentType.payment_type_id;
  document.getElementById("edit-div").style.display = "block";
};

const updatePaymentType = async () => {
  const jsonData = {
    typeName: document.getElementById("update-type-name").value,
    paymentTypeId: document.getElementById("update-payment-type-id").value,
  };

  const formData = new FormData();
  formData.append("operation", "updatePaymentType");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/paymenttype.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayPaymentTypes();
    document.getElementById("edit-div").style.display = "none";
    alert("Payment Type has been successfully updated!");
  } else {
    alert("ERROR!");
  }
};

const deletePaymentType = async (paymentTypeId) => {
  const params = {
    operation: "deletePaymentType",
    json: JSON.stringify({ paymentTypeId: paymentTypeId }),
  };
  const response = await axios.get(`${baseApiUrl}/paymenttype.php`, {
    params: params,
  });

  if (response.data == 1) {
    displayPaymentTypes();
    alert("Payment Type has been deactivated!");
  } else {
    alert("ERROR");
  }
};
