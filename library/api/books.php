<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class Book {

    // ================================
    // IMPORTANT FUNCTION: getAllBooks
    // Retrieves all book records, joined with tblcategories to get the genre name
    // ================================
    function getAllBooks(){
      //connect to the database
      include "connection-pdo.php";

      $sql = "SELECT a.*, b.cat_name
              FROM tblbooks a INNER JOIN tblcategories b
              ON a.book_category_id = b.cat_id
              ORDER BY a.book_title";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
    }

    // ================================
    // IMPORTANT FUNCTION: getCategories
    // Retrieves all book categories/genres from the separate tblcategories table
    // ================================
    function getCategories(){
      include "connection-pdo.php";

      $sql = "SELECT cat_id, cat_name
              FROM tblcategories
              ORDER BY cat_name";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
    }

    // ================================
    // IMPORTANT FUNCTION: insertBook
    // Validates and inserts a new book record using PDO + prepared statement
    // ================================
    function insertBook($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);

      //server-side validation - make sure required fields are not empty
      if(empty($json['title']) || empty($json['author']) || empty($json['isbn'])){
        $returnValue = 0;
        return json_encode($returnValue);
      }

      $sql = "INSERT INTO tblbooks(book_title, book_author, book_isbn, book_category_id, 
        book_year_published, book_publisher)
        VALUES(:title, :author, :isbn, :categoryId, :yearPublished, :publisher)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":title", $json['title']);
      $stmt->bindParam(":author", $json['author']);
      $stmt->bindParam(":isbn", $json['isbn']);
      $stmt->bindParam(":categoryId", $json['categoryId']);
      $stmt->bindParam(":yearPublished", $json['yearPublished']);
      $stmt->bindParam(":publisher", $json['publisher']);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

      return json_encode($returnValue);
    }

    // ================================
    // IMPORTANT FUNCTION: getBook
    // Retrieves a single book record (joined with tblcategories) for the
    // View/Update modals
    // ================================
    function getBook($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT a.*, b.cat_name
              FROM tblbooks a INNER JOIN tblcategories b
              ON a.book_category_id = b.cat_id
              WHERE a.book_id = :bookId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":bookId", $json['bookId']);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
    }

    // ================================
    // IMPORTANT FUNCTION: updateBook
    // Updates a book record using PDO and a prepared statement
    // ================================
    function updateBook($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "UPDATE tblbooks SET book_title=:title, book_author=:author, 
                book_isbn=:isbn, book_category_id=:categoryId, 
                book_year_published=:yearPublished, book_publisher=:publisher
              WHERE book_id=:bookId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":title", $json['title']);
      $stmt->bindParam(":author", $json['author']);
      $stmt->bindParam(":isbn", $json['isbn']);
      $stmt->bindParam(":categoryId", $json['categoryId']);
      $stmt->bindParam(":yearPublished", $json['yearPublished']);
      $stmt->bindParam(":publisher", $json['publisher']);
      $stmt->bindParam(":bookId", $json['bookId']);
      $stmt->execute();

      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
      return json_encode($returnValue);
    }

    // ================================
    // IMPORTANT FUNCTION: deleteBook
    // Deletes a book record using PDO and a prepared statement
    // ================================
    function deleteBook($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "DELETE FROM tblbooks
              WHERE book_id = :bookId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":bookId", $json['bookId']);
      $stmt->execute();
      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;

      return json_encode($returnValue);
    }

  }

  //submitted by the client - operation and json
  if ($_SERVER['REQUEST_METHOD'] == 'GET'){
    $operation = $_GET['operation'];
    $json = isset($_GET['json']) ? $_GET['json'] : "";
  }else if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $operation = $_POST['operation'];
    $json = isset($_POST['json']) ? $_POST['json'] : "";
  }

  $book = new Book();
  switch($operation){
    case "getAllBooks":
      echo $book->getAllBooks();
      break;
    case "insertBook":
      echo $book->insertBook($json);
      break;
    case "getCategories":
      echo $book->getCategories();
      break;
    case "getBook":
      echo $book->getBook($json);
      break;
    case "updateBook":
      echo $book->updateBook($json);
      break;
    case "deleteBook":
      echo $book->deleteBook($json);
      break;
    }

?>