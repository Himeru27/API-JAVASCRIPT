export const deleteModal = async (studId, refreshDisplay) => {
  document.getElementById("blank-modal-title").innerText = "Confirm Delete";

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
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-danger btn-sm w-100 me-2 btn-delete">Delete</button>
        <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-dismiss="modal">Close</button>
      </div>
   `;
  modalFooter.innerHTML = myHtml;

  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  modalFooter.querySelector(".btn-delete").addEventListener("click", async() => {
    if(await deleteRecord(student[0].stud_id) == 1){
      refreshDisplay();
      alert("Record has been deleted!");
      myModal.hide();
    }else{
      alert("ERROR");
    };
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

const deleteRecord = async (studId) => {
  const params = {
    operation: "deleteStudent",
    json: JSON.stringify({ studId: studId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/students.php`,
    {
      params: params,
    }
  );
  console.log(response.data)
  return response.data;
};
