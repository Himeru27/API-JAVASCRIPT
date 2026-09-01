const getApi = async ()=>{
	const api = "http://localhost/study/api/";
	
	const name = document.getElementById("name").value;
	
	const skill = {language: "Javascript", hobby: "Programming"};
	const formData = new FormData();
	formData.append("name", name);
	formData.append("skill", JSON.stringify(skill));
	
	const response = await axios({
		url: `${api}/greetings.php`,
		method: "POST",
		data: formData
	});
	
	if(response.status == 200){
		
		const student = response.data;
		console.log(student.name);
		console.log(student.language);
		console.log(student.hobby);
	}else{
		alert("Error");
	}
}

document.addEventListener("DOMContentLoaded", ()=>{
	document.getElementById("submit").addEventListener("click", ()=>{
		getApi();
	});
})