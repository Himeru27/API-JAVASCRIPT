import { updateModal } from "./update.js";
import { deleteModal } from "./delete.js";

const baseApiUrl = "http://localhost/library/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);
let categories = [];
let details = [];
let allBooksList = [];

document.addEventListener("DOMContentLoaded", () => {
  displayCategories();
  displayBooks();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertBook();
  });
  onBorrowPageLoad();
});

// ================================
// IMPORTANT FUNCTION: displayCategories
// Sends an Axios GET request to retrieve genres from the separate
// tblcategories table and populates the category dropdown
// ================================
const displayCategories = async () => {
  const select = document.getElementById("category");

  const response = await axios.get(`${baseApiUrl}/books.php`, {
    params: { operation: "getCategories" },
  });
  if (response.status == 200) {
    categories = response.data;
    categories.forEach((category) => {
      let option = document.createElement("option");
      option.innerText = category.cat_name;
      option.value = category.cat_id;
      select.appendChild(option);
    });
  } else {
    alert("Error!");
  }
};

// ================================
// IMPORTANT FUNCTION: displayBooks
// Sends an Axios GET request to retrieve all books from the PHP API
// ================================
const displayBooks = async () => {
  const response = await axios.get(`${baseApiUrl}/books.php`, {
    params: { operation: "getAllBooks" },
  });

  if (response.status == 200) {
    displayBooksTable(response.data);
  } else {
    alert("Error!");
  }
};

// ================================
// IMPORTANT FUNCTION: displayBooksTable
// Dynamically updates the Book Display page using DOM manipulation
// ================================
const displayBooksTable = (books) => {
  const tableDiv = document.getElementById("table-div");
  tableDiv.innerHTML = "";

  const table = document.createElement("table");

  table.classList.add("table", "table-hover", "table-striped", "table-sm");

  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>  
        <th class="text-white bg-success">TITLE</th>
        <th class="text-white bg-success">AUTHOR</th>
        <th class="text-white bg-success">ISBN</th>
        <th class="text-white bg-success">CATEGORY</th>
        <th class="text-white bg-success">YEAR PUBLISHED</th>
        <th class="text-white bg-success">PUBLISHER</th>
        <th class="text-white bg-success">ACTION</th>
      </tr>
    `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  books.forEach((book) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.book_title}</td>
        <td>${book.book_author}</td>
        <td>${book.book_isbn}</td>
        <td>${book.cat_name}</td>
        <td>${book.book_year_published}</td>
        <td>${book.book_publisher}</td>
        <td>
          <button type='button' class='btn btn-success btn-sm btn-update'>Update</button>
          <button type='button' class='btn btn-danger btn-sm btn-delete'>Delete</button>
        </td>

      `;
    tbody.appendChild(row);
    row.querySelector(".btn-update").addEventListener("click", () =>{
      updateModal(book.book_id, categories, displayBooks);
    });
    row.querySelector(".btn-delete").addEventListener("click", () =>{
      deleteModal(book.book_id, displayBooks);
    });
  });
  table.appendChild(tbody);

  tableDiv.appendChild(table);
};

// ================================
// IMPORTANT FUNCTION: insertBook
// Validates form data, then sends an Axios POST request to the PHP API
// ================================
const insertBook = async () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const category = document.getElementById("category").value;
  const yearPublished = document.getElementById("year-published").value;
  const publisher = document.getElementById("publisher").value;

  //client-side validation - make sure required fields are not empty
  if(title == "" || author == "" || isbn == ""){
    alert("Please fill out Title, Author, and ISBN.");
    return;
  }

  const jsonData = {
    title: title,
    author: author,
    isbn: isbn,
    categoryId: category,
    yearPublished: yearPublished,
    publisher: publisher,
  };

  const formData = new FormData();
  formData.append("operation", "insertBook");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/books.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    displayBooks();
    clearForm();
    alert("Book successfully added!");
  } else {
    alert("ERROR");
  }
};

const clearForm = () => {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("year-published").value = "";
  document.getElementById("publisher").value = "";
};

// ================================
// IMPORTANT FUNCTION: saveBorrow
// Validates form data, then sends an Axios POST request to the PHP API
// ================================
const saveBorrow = async () => {
  const header = {
    studentId: document.getElementById("students-select").value,
    borrowDate: document.getElementById("borrow-date").value,
    userId: 1, //the user's primary key (just defaulted to 1)
  };

  const jsonData = { header: header, details: details };

  const formData = new FormData();
  formData.append("operation", "saveBorrow");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/borrow.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    alert("Borrow transaction has been successfully saved!");
  } else {
    alert("ERROR!");
  }
};

// ================================
// IMPORTANT FUNCTION: openDetailsModal
// Populates the blank modal with a book select and qty field
// ================================
const openDetailsModal = async () => {
  document.getElementById("blank-modal-title").innerText = "Add Borrow Details";
  //get the books list and append them to the books select drop down
  allBooksList = await getAllBooksList();

  let myHtml = `
      <input type="number" class="form-control input-qty" id="qty" placeholder="qty" value="1" />
      <select class="form-select book-select" id="book">
        <option value="0">SELECT BOOK</option>
    `;
  allBooksList.forEach((book) => {
    myHtml += `<option value="${book.book_id}">${book.book_title}</option>`;
  });
  myHtml += `</select>`;

  const modalBody = document.getElementById("blank-main-div");
  modalBody.innerHTML = myHtml;

  //listen to change event of the book select
  modalBody.querySelector(".book-select").addEventListener("change", (e) => {
    //get the qty
    const qty = modalBody.querySelector(".input-qty").value;
    //get the selected book id
    const bookId = e.target.value;
    //get book
    const book = allBooksList.find((book) => book.book_id == bookId);
    if (book) {
      //add to details list
      const item = {
        bookId: book.book_id,
        bookTitle: book.book_title,
        qty: qty,
      };
      details.push(item);
      displayDetails();
    }
  });

  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  myModal.show();
};

// ================================
// IMPORTANT FUNCTION: displayDetails
// Dynamically updates the borrow details table using DOM manipulation
// ================================
const displayDetails = () => {
  //get the table body object
  const tbody = document.getElementById("details-body");
  //iterate thru the details list and display each in the table
  let myHtml = ``;
  details.forEach((detail) => {
    myHtml += `
        <tr>
          <td>${detail.bookTitle}</td>
          <td>${detail.qty}</td>
        </tr>
      `;
  });
  tbody.innerHTML = myHtml;
};

// ================================
// IMPORTANT FUNCTION: onBorrowPageLoad
// Loads students into the select element and sets up borrow-related event listeners
// ================================
const onBorrowPageLoad = async () => {
  //load students to select element
  const select = document.getElementById("students-select");
  const students = await getAllStudents();

  var html = `<option value="0">-- SELECT STUDENT --</option>`;
  students.forEach((student) => {
    html += `<option value=${student.stud_id}>${student.stud_last_name}, ${student.stud_first_name}</option>`;
  });
  select.innerHTML = html;

  //set the date to today
  document.getElementById("borrow-date").value = formatDateYYYYMMDD();

  //set the onclick event of the details button
  document.getElementById("button-details").addEventListener("click", () => {
    openDetailsModal();
  });

  //set the onclick event of the save button
  document.getElementById("button-save").addEventListener("click", () => {
    saveBorrow();
  });
};

const getAllStudents = async () => {
  const response = await axios.get(`${baseApiUrl}/students.php`, {
    params: { operation: "getAllStudents" },
  });

  if (response.status == 200) {
    return response.data;
  } else {
    alert("Error!");
  }
};

const getAllBooksList = async () => {
  const response = await axios.get(`${baseApiUrl}/books.php`, {
    params: { operation: "getAllBooks" },
  });

  if (response.status == 200) {
    return response.data;
  } else {
    alert("Error!");
  }
};

const formatDateYYYYMMDD = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0
  const dd = String(today.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};