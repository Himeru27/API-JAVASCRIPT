document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const greetingDiv = document.getElementById("greeting-div");

  if (user) {
    greetingDiv.innerText = `Hello, ${user.username}! Welcome to the Hotel Billing System.`;
  } else {
    greetingDiv.innerText = "Hello! Please log in.";
  }
});
