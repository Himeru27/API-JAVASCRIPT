<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class Users {
    function login($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT a.*, b.role_type
              FROM tbl_users a INNER JOIN tblrole b
              ON a.role_id = b.role_id
              WHERE a.username = :username AND a.user_status = 'Active'";
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

      //new registrations default to the "User" role (role_id = 2)
      $sql = "INSERT INTO tbl_users(role_id, username, password, email, user_status)
              VALUES(2, :username, :password, :email, 'Active')";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":username", $json['username']);
      $stmt->bindParam(":password", $hashedPassword);
      $stmt->bindParam(":email", $json['email']);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

      return json_encode($returnValue);
    }

    // Admin feature: list all registered users with their role
    function getAllUsers(){
      include "connection-pdo.php";

      $sql = "SELECT a.user_id, a.username, a.email, a.user_status, a.createdAt,
                     b.role_id, b.role_type
              FROM tbl_users a INNER JOIN tblrole b
              ON a.role_id = b.role_id
              ORDER BY a.username";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
    }

    // Admin feature: change a user's role or status
    function updateUser($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "UPDATE tbl_users SET role_id = :roleId, user_status = :userStatus
              WHERE user_id = :userId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":roleId", $json['roleId']);
      $stmt->bindParam(":userStatus", $json['userStatus']);
      $stmt->bindParam(":userId", $json['userId']);
      $stmt->execute();

      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
      return json_encode($returnValue);
    }

    // Lookup table for role dropdown
    function getAllRoles(){
      include "connection-pdo.php";

      $sql = "SELECT * FROM tblrole ORDER BY role_type";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
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
    case "getAllUsers":
      echo $users->getAllUsers();
      break;
    case "updateUser":
      echo $users->updateUser($json);
      break;
    case "getAllRoles":
      echo $users->getAllRoles();
      break;
    }

?>
