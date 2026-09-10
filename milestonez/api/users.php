<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class Users {
    function login($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT * FROM tbl_users
              WHERE username = :username AND is_active = 1";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":username", $json['username']);
      $stmt->execute();
      $rs = $stmt->fetch(PDO::FETCH_ASSOC);

      if($rs && password_verify($json['password'], $rs['password'])){
        unset($rs['password']);
        return json_encode($rs);
      }else{
        return json_encode(0);
      }
    }

    function register($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      //check if username already exists
      $checkSql = "SELECT user_id FROM tbl_users WHERE username = :username";
      $checkStmt = $conn->prepare($checkSql);
      $checkStmt->bindParam(":username", $json['username']);
      $checkStmt->execute();

      if($checkStmt->rowCount() > 0){
        return json_encode(0); //username already taken
      }

      $hashedPassword = password_hash($json['password'], PASSWORD_DEFAULT);

      $sql = "INSERT INTO tbl_users(username, password, is_active)
              VALUES(:username, :password, 1)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":username", $json['username']);
      $stmt->bindParam(":password", $hashedPassword);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

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

  $users = new Users();
  switch($operation){
    case "login":
      echo $users->login($json);
      break;
    case "register":
      echo $users->register($json);
      break;
    }

?>
