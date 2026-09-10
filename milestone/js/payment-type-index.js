import { updatePaymentTypeModal } from "./modules/update-payment-type.js";
import { deletePaymentTypeModal } from "./modules/delete-payment-type.js";

const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  displayPaymentTypes();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertPaymentType();
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
  table.classList.add("table", "table-hover", "table-striped", "table-sm");

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
          <button type='button' class='btn btn-success btn-sm btn-update'>Update</button>
          <button type='button' class='btn btn-danger btn-sm btn-delete'>Delete</button>
        </td>
      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () => {
      updatePaymentTypeModal(paymentType.payment_type_id, displayPaymentTypes);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deletePaymentTypeModal(paymentType.payment_type_id, displayPaymentTypes);
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
