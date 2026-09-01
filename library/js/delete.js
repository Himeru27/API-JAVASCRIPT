export const deleteModal = async (bookId, refreshDisplay) => {
  document.getElementById("blank-modal-title").innerText = "Confirm Delete";

  const book = await getBookDetails(bookId);
  let myHtml = `
        <table class="table table-sm">
          <tr>
            <td>Book Title</td>
            <td>${book[0].book_title}</td>
          </tr>
          <tr>
            <td>Author</td>
            <td>${book[0].book_author}</td>
          </tr>
          <tr>
            <td>ISBN</td>
            <td>${book[0].book_isbn}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>${book[0].cat_name}</td>
          </tr>
          <tr>
            <td>Year Published</td>
            <td>${book[0].book_year_published}</td>
          </tr>
          <tr>
            <td>Publisher</td>
            <td>${book[0].book_publisher}</td>
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
    if(await deleteRecord(book[0].book_id) == 1){
      refreshDisplay();
      alert("Book has been deleted!");
      myModal.hide();
    }else{
      alert("ERROR");
    };
  });

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

const deleteRecord = async (bookId) => {
  const params = {
    operation: "deleteBook",
    json: JSON.stringify({ bookId: bookId }),
  };
  const response = await axios.get(
    `${sessionStorage.baseAPIUrl}/books.php`,
    {
      params: params,
    }
  );
  console.log(response.data)
  return response.data;
};