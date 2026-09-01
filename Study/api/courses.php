<?php
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  class Course {

    function getCourses(){
      include "connection-pdo.php";

      $sql = "SELECT crs_id, crs_title 
              FROM tblcourses
              ORDER BY crs_title";
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($rs);
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

  $course = new Course();
  switch($operation){
    case "getCourses":
      echo $course->getCourses();
      break;
    }

?>