<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Borrow
{
  function saveBorrow($json)
  {
    include "connection-pdo.php";

    $json = json_decode($json, true);

    //get header and details data separately
    $header = $json['header'];
    $details = $json['details'];

    try {
      $conn->beginTransaction();

      //save the header
      $sql = "INSERT INTO tbl_borrow_header(hdr_student_id, hdr_date, hdr_user_id)
          VALUES(:studentId, :borrowDate, :userId)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":studentId", $header['studentId']);
      $stmt->bindParam(":borrowDate", $header['borrowDate']);
      $stmt->bindParam(":userId", $header['userId']);
      $stmt->execute();
      //get the newly inserted record's Auto-Increment value
      $newId = $conn->lastInsertId();

      //iterate thru the details array and save each record
      //which now includes the header id
      $sqlDtl = "INSERT INTO tbl_borrow_details(dtl_header_id, dtl_book_id, dtl_qty)
          VALUES(:headerId, :bookId, :qty)
        ";
      $stmtDtl = $conn->prepare($sqlDtl);
      foreach ($details as $row) {
        $stmtDtl->bindParam(":headerId", $newId);
        $stmtDtl->bindParam(":bookId", $row['bookId']);
        $stmtDtl->bindParam(":qty", $row['qty']);
        $stmtDtl->execute();
      }
      //commit changes
      $conn->commit();
      $returnValue = 1;
    } catch (Exception $e) {
      $conn->rollBack();
      $returnValue = 0;
    }
    return json_encode($returnValue);
  }
}

//submitted by the client - operation and json
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = $_GET['operation'];
  $json = isset($_GET['json']) ? $_GET['json'] : "";
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'];
  $json = isset($_POST['json']) ? $_POST['json'] : "";
}

$borrow = new Borrow();
switch ($operation) {
  case "saveBorrow":
    echo $borrow->saveBorrow($json);
    break;
}