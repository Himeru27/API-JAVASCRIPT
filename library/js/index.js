import { updateModal } from "./update.js";
import { deleteModal } from "./delete.js";

const baseApiUrl = "http://localhost/library/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);
let categories = [];

document.addEventListener("DOMContentLoaded", () => {
  displayCategories();
  displayBooks();
  document.getElementById("btn-submit").addEventListener("click", () => {
    insertBook();
  });
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
        <th>TITLE</th>
        <th>AUTHOR</th>
        <th>ISBN</th>
        <th>CATEGORY</th>
        <th>YEAR PUBLISHED</th>
        <th>PUBLISHER</th>
        <th>ACTION</th>
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