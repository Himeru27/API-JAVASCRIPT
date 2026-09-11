const baseApiUrl = "http://localhost/milestone1/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("register-btn-submit").addEventListener("click", () => {
    register();
  });
});

const register = async () => {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  if (username.trim() == "" || password.trim() == "") {
    alert("Please enter a valid username and password!");
    return;
  }

  const jsonData = {
    username: username,
    password: password,
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
