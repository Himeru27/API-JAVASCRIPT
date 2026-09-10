<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class RoomType {
    function getAllRoomTypes(){
      include "connection-pdo.php";

      $sql = "SELECT * FROM tblroomtype
              WHERE is_active = 1
              ORDER BY room_type_name";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
    }

    function insertRoomType($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "INSERT INTO tblroomtype(room_type_name, room_description, room_rate, is_active)
              VALUES(:typeName, :description, :rate, 1)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":typeName", $json['typeName']);
      $stmt->bindParam(":description", $json['description']);
      $stmt->bindParam(":rate", $json['rate']);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

      return json_encode($returnValue);
    }

    function getRoomType($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT * FROM tblroomtype
              WHERE room_type_id = :roomTypeId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roomTypeId", $json['roomTypeId']);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
    }

    function updateRoomType($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "UPDATE tblroomtype SET room_type_name=:typeName,
                room_description=:description, room_rate=:rate
              WHERE room_type_id=:roomTypeId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":typeName", $json['typeName']);
      $stmt->bindParam(":description", $json['description']);
      $stmt->bindParam(":rate", $json['rate']);
      $stmt->bindParam(":roomTypeId", $json['roomTypeId']);
      $stmt->execute();

      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
      return json_encode($returnValue);
    }

    // SOFT DELETE: room types are referenced by Rooms and used in past Bookings/Bills.
    // Deactivating instead of removing keeps historical records valid.
    function deleteRoomType($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "UPDATE tblroomtype SET is_active = 0
              WHERE room_type_id = :roomTypeId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roomTypeId", $json['roomTypeId']);
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

  $roomType = new RoomType();
  switch($operation){
    case "getAllRoomTypes":
      echo $roomType->getAllRoomTypes();
      break;
    case "insertRoomType":
      echo $roomType->insertRoomType($json);
      break;
    case "getRoomType":
      echo $roomType->getRoomType($json);
      break;
    case "updateRoomType":
      echo $roomType->updateRoomType($json);
      break;
    case "deleteRoomType":
      echo $roomType->deleteRoomType($json);
      break;
    }

?>
