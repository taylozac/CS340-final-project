// get login form
const registerForm = document.forms["register-form"];

// add submit event listener
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission

  // get username and password fields
  let username = registerForm.elements["username"].value;
  let password = registerForm.elements["password"].value;
  let passwordConfirm = registerForm.elements["confirm-password"].value;

  // check that passwords are the same
  if (password !== passwordConfirm) {
    alert("Passwords must match!");
    return;
  } else {
    // send username and password to the server
    try {
      let response = await axios.post("/register", {
        username,
        password,
      });
    } catch (err) {
      console.log(err.message);
      alert("Error:");
    }
  }
});
