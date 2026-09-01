export const viewModal = async (studId) => {
  //prepare the modal content
  document.getElementById("blank-modal-title").innerText = "View Details";

  const student = await getStudentDetails(studId);
  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>School ID</td>
            <td>${student[0].stud_school_id}</td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>${student[0].stud_last_name}</td>
          </tr>
          <tr>
            <td>First Name</td>
            <td>${student[0].stud_first_name}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>${student[0].stud_address}</td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>${student[0].stud_dob}</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>${student[0].crs_code}</td>
          </tr>
          <tr>
            <td>Balance</td>
            <td>${student[0].stud_balance}</td>
          </tr>
        </table>
    `;
  document.getElementById("blank-main-div").innerHTML = myHtml;

  const modalFooter = document.getElementById("blank-modal-footer");
  myHtml = `
      <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-dismiss="modal">Close</button>
    `;
  modalFooter.innerHTML = myHtml;

  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  myModal.show();
};

const getStudentDetails = async (studId) => {
  const params = {
    operation: "getStudent",
    json: JSON.stringify({ studId: studId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/students.php`,
    {
      params: params,
    }
  );
  return response.data;
};