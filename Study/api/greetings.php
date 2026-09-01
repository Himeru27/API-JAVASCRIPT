<?php

	$name = $_POST["name"];
	$skill = json_decode($_POST["skill"], true);
	
	$language = $skill["language"];
	$hobby = $skill["hobby"];
	
	$returnValue = array("name" => $name, "language" => $language, "hobby" => $hobby);
	
	echo json_encode($returnValue);
?>