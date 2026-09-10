<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class PaymentType {
    function getAllPaymentTypes(){
      include "connection-pdo.php";

      $sql = "SELECT * FROM tblpaymenttype
              WHERE is_active = 1
              ORDER BY payment_type_name";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
    }

    function insertPaymentType($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "INSERT INTO tblpaymenttype(payment_type_name, is_active)
              VALUES(:typeName, 1)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":typeName", $json['typeName']);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

      return json_encode($returnValue);
    }

    function getPaymentType($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT * FROM tblpaymenttype
              WHERE payment_type_id = :paymentTypeId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":paymentTypeId", $json['paymentTypeId']);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
    }

    function updatePaymentType($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "UPDATE tblpaymenttype SET payment_type_name=:typeName
              WHERE payment_type_id=:paymentTypeId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":typeName", $json['typeName']);
      $stmt->bindParam(":paymentTypeId", $json['paymentTypeId']);
      $stmt->execute();

      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
      return json_encode($returnValue);
    }

    // SOFT DELETE: payment types are referenced by past Payment records.
    // Deactivating keeps historical payments valid and auditable.
    function deletePaymentType($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "UPDATE tblpaymenttype SET is_active = 0
              WHERE payment_type_id = :paymentTypeId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":paymentTypeId", $json['paymentTypeId']);
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

  $paymentType = new PaymentType();
  switch($operation){
    case "getAllPaymentTypes":
      echo $paymentType->getAllPaymentTypes();
      break;
    case "insertPaymentType":
      echo $paymentType->insertPaymentType($json);
      break;
    case "getPaymentType":
      echo $paymentType->getPaymentType($json);
      break;
    case "updatePaymentType":
      echo $paymentType->updatePaymentType($json);
      break;
    case "deletePaymentType":
      echo $paymentType->deletePaymentType($json);
      break;
    }

?>
