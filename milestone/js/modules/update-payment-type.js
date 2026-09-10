export const updatePaymentTypeModal = async (paymentTypeId, refreshDisplay) => {
  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  document.getElementById("blank-modal-title").innerText = "Update Payment Type";

  const paymentType = await getPaymentTypeDetails(paymentTypeId);

  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Payment Type Name</td>
            <td>
              <input type="text" id="update-type-name" class="form-control" value="${paymentType[0].payment_type_name}" />
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
    if (await updatePaymentType(paymentTypeId) == 1) {
      refreshDisplay();
      alert("Payment Type has been successfully updated!");
      myModal.hide();
    } else {
      alert("ERROR!");
    }
  });

  myModal.show();
};

const getPaymentTypeDetails = async (paymentTypeId) => {
  const params = {
    operation: "getPaymentType",
    json: JSON.stringify({ paymentTypeId: paymentTypeId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/paymenttype.php`,
    { params: params }
  );
  return response.data;
};

const updatePaymentType = async (paymentTypeId) => {
  const jsonData = {
    typeName: document.getElementById("update-type-name").value,
    paymentTypeId: paymentTypeId,
  };

  const formData = new FormData();
  formData.append("operation", "updatePaymentType");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${sessionStorage.baseAPIUrl}/paymenttype.php`,
    method: "POST",
    data: formData,
  });
  console.log(response.data);
  return response.data;
};
