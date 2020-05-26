// get login form
const loginForm = document.forms["login-form"];

// add submit event listener
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission

  // get username and password fields
  let username = loginForm.elements["username"].value;
  let password = loginForm.elements["password"].value;

  // send username and password to the server
  try {
    let response = await axios.post("/login", {
      username: username,
      password: password,
    });

    if (!response.data.wasSuccess) {
      alert(response.data.message);
    } else {
      window.location = "/home";
    }
  } catch (err) {
    alert("Username and password not recognized");
    loginForm.reset();
  }
});
