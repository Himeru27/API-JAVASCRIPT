import { viewModal } from "../modules/view.js";
import { updateModal } from "../modules/update.js";
import { deleteModal } from "../modules/delete.js";

const baseApiUrl = "http://localhost/study/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);
let courses = [];

document.addEventListener("DOMContentLoaded", () => {
  displayCourses();
  displayStudents();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertStudent();
  });
});

const displayStudents = async () => {
  const response = await axios.get(`${baseApiUrl}/students.php`, {
    params: { operation: "getAllStudents" },
  });

  if (response.status == 200) {
    displayStudentsTable(response.data);
  } else {
    alert("Error!");
  }
};

const displayStudentsTable = (students) => {
  const tableDiv = document.getElementById("table-div");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");

  table.classList.add("table", "table-hover", "table-striped", "table-sm");

  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>  
        <th>ID</th>
        <th>LAST NAME</th>
        <th>FIRST NAME</th>
        <th>COURSE</th>
        <th>ADDRESS</th>
        <th>ACTION</th>
      </tr>
    `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  students.forEach((student) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.stud_school_id}</td>
        <td>${student.stud_last_name}</td>
        <td>${student.stud_first_name}</td>
        <td>${student.crs_code}</td>
        <td>${student.stud_address}</td>
        <td>
          <button type='button' class='btn btn-primary btn-sm btn-view'>View</button>
          <button type='button' class='btn btn-success btn-sm btn-update'>Update</button>
          <button type='button' class='btn btn-danger btn-sm btn-delete'>Delete</button>
        </td>

      `;
    tbody.appendChild(row);
    row.querySelector(".btn-view").addEventListener("click", () =>{
      viewModal(student.stud_id);
    });
    row.querySelector(".btn-update").addEventListener("click", () =>{
      updateModal(student.stud_id, courses, displayStudents);
    });
    row.querySelector(".btn-delete").addEventListener("click", () =>{
      deleteModal(student.stud_id, displayStudents);
    });
  });
  table.appendChild(tbody);

  tableDiv.appendChild(table);
};

const displayCourses = async () => {
  const select = document.getElementById("course");

  const response = await axios.get(`${baseApiUrl}/courses.php`, {
    params: { operation: "getCourses" },
  });
  if (response.status == 200) {
    //display courses in the select element
    courses = response.data;
    courses.forEach((course) => {
      let option = document.createElement("option");
      option.innerText = course.crs_title;
      option.value = course.crs_id;
      select.appendChild(option);
    });
  } else {
    alert("Error!");
  }
};

const insertStudent = async () => {
  const jsonData = {
    schoolId: document.getElementById("school-id").value,
    lastName: document.getElementById("last-name").value,
    firstName: document.getElementById("first-name").value,
    courseId: document.getElementById("course").value,
    address: document.getElementById("address").value,
    dob: document.getElementById("birth-date").value,
    balance: document.getElementById("balance").value,
  };

  const formData = new FormData();
  formData.append("operation", "insertStudent");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/students.php`,
    method: "POST",
    data: formData,
  });


  if (response.data == 1) {
    displayStudents();
    alert("Student Successfully save!");
  } else {
    alert("ERROR");
  }
};

