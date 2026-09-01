export const updateModal = async (bookId, categories, refreshDisplay) => {
  const myModal = new bootstrap.Modal(document.getElementById("blank-modal"), {
    keyboard: true,
    backdrop: "static",
  });

  //prepare the modal content
  document.getElementById("blank-modal-title").innerText = "Update Book Record";

  const book = await getBookDetails(bookId);

  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Book Title</td>
            <td>
              <input type="text" id="update-title" class="form-control" value="${book[0].book_title}" />
            </td>
          </tr>
          <tr>
            <td>Author</td>
            <td>
              <input type="text" id="update-author" class="form-control" value="${book[0].book_author}" />
            </td>
          </tr>
          <tr>
            <td>ISBN</td>
            <td>
              <input type="text" id="update-isbn" class="form-control" value="${book[0].book_isbn}" />
            </td>
          </tr>
          <tr>
            <td>Category</td>
            <td>
              ${createCategorySelect(categories, book[0].book_category_id)}
            </td>
          </tr>
          <tr>
            <td>Year Published</td>
            <td>
              <input type="number" id="update-year-published" class="form-control" value="${book[0].book_year_published}" />
            </td>
          </tr>
          <tr>
            <td>Publisher</td>
            <td>
              <input type="text" id="update-publisher" class="form-control" value="${book[0].book_publisher}" />
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
    //update book record
    if(await updateBook(bookId) == 1){
      refreshDisplay();
      alert("Book record has been successfully updated!");
      myModal.hide();
    }else{
      alert("ERROR!");
    }
  })

  myModal.show();
};

const getBookDetails = async (bookId) => {
  const params = {
    operation: "getBook",
    json: JSON.stringify({ bookId: bookId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/books.php`,
    {
      params: params,
    }
  );
  return response.data;
};

const createCategorySelect = (categories, categoryId) => {
  let myHtml = `<select id="update-category" class="form-select">`;

  categories.forEach(category => {
    let selected = categoryId == category.cat_id ? "selected" : "";
    myHtml += `<option value="${category.cat_id}" ${selected}>${category.cat_name}</option>`;
  });

  myHtml += "</select>";
  return myHtml;
}

const updateBook = async(bookId) => {
    const jsonData = {
    title: document.getElementById("update-title").value,
    author: document.getElementById("update-author").value,
    isbn: document.getElementById("update-isbn").value,
    categoryId: document.getElementById("update-category").value,
    yearPublished: document.getElementById("update-year-published").value,
    publisher: document.getElementById("update-publisher").value,
    bookId: bookId
  };

  const formData = new FormData();
  formData.append("operation", "updateBook");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${sessionStorage.baseAPIUrl}/books.php`,
    method: "POST",
    data: formData,
  });
  console.log(response.data)
  return response.data;
}