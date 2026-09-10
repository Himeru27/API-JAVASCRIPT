export const deletePaymentTypeModal = async (paymentTypeId, refreshDisplay) => {
  document.getElementById("blank-modal-title").innerText = "Confirm Delete";

  const paymentType = await getPaymentTypeDetails(paymentTypeId);
  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Payment Type</td>
            <td>${paymentType[0].payment_type_name}</td>
          </tr>
        </table>
        <p class="text-muted small">
          This payment type will be deactivated and hidden from selection lists.
          It will not be permanently removed, so past payments that reference
          it will remain valid and auditable.
        </p>
    `;
  document.getElementById("blank-main-div").innerHTML = myHtml;

  const modalFooter = document.getElementById("blank-modal-footer");
  myHtml = `
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-danger btn-sm w-100 me-2 btn-delete">Deactivate</button>
        <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-dismiss="modal">Close</button>
      </div>
   `;
  modalFooter.innerHTML = myHtml;

  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  modalFooter.querySelector(".btn-delete").addEventListener("click", async () => {
    if (await deleteRecord(paymentType[0].payment_type_id) == 1) {
      refreshDisplay();
      alert("Payment Type has been deactivated!");
      myModal.hide();
    } else {
      alert("ERROR");
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

const deleteRecord = async (paymentTypeId) => {
  const params = {
    operation: "deletePaymentType",
    json: JSON.stringify({ paymentTypeId: paymentTypeId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/paymenttype.php`,
    { params: params }
  );
  console.log(response.data);
  return response.data;
};
