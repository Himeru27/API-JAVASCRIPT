export const updateModal = async (studId, courses, refreshDisplay) => {
  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  //prepare the modal content
  document.getElementById("blank-modal-title").innerText = "Update Student Record";

  const student = await getStudentDetails(studId);

  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>School ID</td>
            <td>
              <input type="text" id="update-school-id" class="form-control" value="${student[0].stud_school_id}" />
            </td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>
              <input type="text" id="update-last-name" class="form-control" value="${student[0].stud_last_name}" />
            </td>
          </tr>
          <tr>
            <td>First Name</td>
            <td>
              <input type="text" id="update-first-name" class="form-control" value="${student[0].stud_first_name}" />
            </td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <input type="text" id="update-address" class="form-control" value="${student[0].stud_address}" />
            </td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>
              <input type="text" id="update-birth-date" class="form-control" value="${student[0].stud_dob}" />
            </td>
          </tr>
          <tr>
            <td>Course</td>
            <td>
              ${createCourseSelect(courses, student[0].stud_course_id)}
            </td>
          </tr>
          <tr>
            <td>Balance</td>
            <td>
              <input type="number" id="update-balance" class="form-control" value="${student[0].stud_balance}" />
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

  modalFooter.querySelector(".btn-update").addEventListener("click", async() => {
    //update student record
    if(await updateStudent(studId) == 1){
      refreshDisplay();
      alert("Student record has been successfully updated!");
      myModal.hide();
    }else{
      alert("ERROR!");
    }
  })

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

const createCourseSelect = (courses, courseId) => {
  let myHtml = `<select id="update-course" class="form-select">`;
  
  courses.forEach(course => {
    let selected = courseId == course.crs_id ? "selected" : "";
    myHtml += `<option value="${course.crs_id}" ${selected}>${course.crs_title}</option>`;
  });

  myHtml += "</select>";
  return myHtml;
}

const updateStudent = async(studId) => {
    const jsonData = {
    schoolId: document.getElementById("update-school-id").value,
    lastName: document.getElementById("update-last-name").value,
    firstName: document.getElementById("update-first-name").value,
    courseId: document.getElementById("update-course").value,
    address: document.getElementById("update-address").value,
    dob: document.getElementById("update-birth-date").value,
    balance: document.getElementById("update-balance").value,
    studId:studId
  };

  const formData = new FormData();
  formData.append("operation", "updateStudent");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${sessionStorage.baseAPIUrl}/students.php`,
    method: "POST",
    data: formData,
  });
  console.log(response.data)
  return response.data;
}