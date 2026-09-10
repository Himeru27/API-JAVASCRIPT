const baseApiUrl = "http://localhost/milestone/api";

sessionStorage.setItem("baseAPIUrl", baseApiUrl);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-submit").addEventListener("click", () => {
    login();
  });
});

const login = async () => {
  const jsonData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
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
    window.location.href = "dashboard.html";
  }
};
