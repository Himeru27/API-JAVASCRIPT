const baseApiUrl = "http://localhost/milestone1/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn-submit").addEventListener("click", () => {
    login();
  });
});

const login = async () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (username.trim() == "" || password.trim() == "") {
    alert("Please enter a valid username and password!");
    return;
  }

  const jsonData = {
    username: username,
    password: password,
  };

  const formData = new FormData();
  formData.append("operation", "login");
  formData.append("json", JSON.stringify(jsonData));

  const response = await axios({
    url: `${baseApiUrl}/users.php`,
    method: "POST",
    data: formData,
  });

  if (response.data == 0) {
    alert("Invalid username or password!");
  } else {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    alert("Login successful!");
    if (response.data.role_type == "Admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "welcome.html";
    }
  }
};
