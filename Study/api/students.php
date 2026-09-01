<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class Student {
    function getAllStudents(){
      //connect to the database
      include "connection-pdo.php";

      $sql = "SELECT a.*, b.crs_code
              FROM tblstudents a INNER JOIN tblcourses b
              ON a.stud_course_id = b.crs_id
              ORDER BY a.stud_last_name";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($rs);
    }

    function insertStudent($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "INSERT INTO tblstudents(stud_school_id, stud_last_name, stud_first_name, stud_course_id, 
        stud_address, stud_dob, stud_balance)
        VALUES(:schoolId, :lastName, :firstName, :courseId, :address, :dob, :balance)";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":schoolId", $json['schoolId']);
      $stmt->bindParam(":lastName", $json['lastName']);
      $stmt->bindParam(":firstName", $json['firstName']);
      $stmt->bindParam(":courseId", $json['courseId']);
      $stmt->bindParam(":address", $json['address']);
      $stmt->bindParam(":dob", $json['dob']);
      $stmt->bindParam(":balance", $json['balance']);
      $stmt->execute();

      $returnValue = 0;
      if($stmt->rowCount() > 0){
        $returnValue = 1;
      }

      return json_encode($returnValue);
    }

    function getStudent($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "SELECT a.*, b.crs_code
              FROM tblstudents a INNER JOIN tblcourses b
              ON a.stud_course_id = b.crs_id
              WHERE a.stud_id = :studId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":studId", $json['studId']);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
    }

    function updateStudent($json){
      include "connection-pdo.php";

      $json = json_decode($json, true);
      $sql = "UPDATE tblstudents SET stud_school_id = :schoolId, stud_last_name=:lastName, 
                stud_first_name=:firstName, stud_course_id=:courseId, 
                stud_address=:address, stud_dob=:dob, stud_balance=:balance
              WHERE stud_id=:studId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":schoolId", $json['schoolId']);
      $stmt->bindParam(":lastName", $json['lastName']);
      $stmt->bindParam(":firstName", $json['firstName']);
      $stmt->bindParam(":courseId", $json['courseId']);
      $stmt->bindParam(":address", $json['address']);
      $stmt->bindParam(":dob", $json['dob']);
      $stmt->bindParam(":balance", $json['balance']);
      $stmt->bindParam(":studId", $json['studId']);
      $stmt->execute();

      $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
      return json_encode($returnValue);
    }

    function deleteStudent($json){
      include "connection-pdo.php";
      $json = json_decode($json, true);

      $sql = "DELETE FROM tblstudents
              WHERE stud_id = :studId";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(":studId", $json['studId']);
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

  $student = new Student();
  switch($operation){
    case "getAllStudents":
      echo $student->getAllStudents();
      break;
    case "insertStudent":
      echo $student->insertStudent($json);
      break;
    case "getStudent":
      echo $student->getStudent($json);
      break;
    case "updateStudent":
      echo $student->updateStudent($json);
      break;
    case "deleteStudent":
      echo $student->deleteStudent($json);
      break;
    }

?>