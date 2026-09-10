const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-submit").addEventListener("click", () => {
    register();
  });
});

const register = async () => {
  const jsonData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  const formData = new FormData();
  formData.append("operation", "register");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/users.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 1) {
    alert("Registration successful! You may now log in.");
    window.location.href = "login.html";
  } else {
    alert("ERROR");
  }
};
