<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class Rooms {
    function getAllRooms(){
      include "connection-pdo.php";

      $sql = "SELECT a.*, b.room_type_name, b.room_rate
              FROM tblrooms a INNER JOIN tblroomtype b
              ON a.room_type_id = b.room_type_id
              WHERE a.is_active = 1
              ORDER BY a.room_number";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
    }

    function insertRoom($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "INSERT INTO tblrooms(room_number, room_type_id, is_active)
              VALUES(:roomNumber, :roomTypeId, 1)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roomNumber", $json['roomNumber']);
      $stmt->bindParam(":roomTypeId", $json['roomTypeId']);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

      return json_encode($returnValue);
    }

    function getRoom($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT a.*, b.room_type_name, b.room_rate
              FROM tblrooms a INNER JOIN tblroomtype b
              ON a.room_type_id = b.room_type_id
              WHERE a.room_id = :roomId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roomId", $json['roomId']);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
    }

    function updateRoom($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "UPDATE tblrooms SET room_number=:roomNumber, room_type_id=:roomTypeId
              WHERE room_id=:roomId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roomNumber", $json['roomNumber']);
      $stmt->bindParam(":roomTypeId", $json['roomTypeId']);
      $stmt->bindParam(":roomId", $json['roomId']);
      $stmt->execute();

      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
      return json_encode($returnValue);
    }

    // SOFT DELETE: rooms may already be tied to Bookings/Room_Transfer history.
    // Deactivating keeps those past transaction records valid.
    function deleteRoom($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "UPDATE tblrooms SET is_active = 0
              WHERE room_id = :roomId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roomId", $json['roomId']);
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

  $rooms = new Rooms();
  switch($operation){
    case "getAllRooms":
      echo $rooms->getAllRooms();
      break;
    case "insertRoom":
      echo $rooms->insertRoom($json);
      break;
    case "getRoom":
      echo $rooms->getRoom($json);
      break;
    case "updateRoom":
      echo $rooms->updateRoom($json);
      break;
    case "deleteRoom":
      echo $rooms->deleteRoom($json);
      break;
    }

?>
