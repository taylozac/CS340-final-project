// get login form
const registerForm = document.forms["register-supplier-form"];

// add submit event listener
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission

  // get username and password fields
  let username = registerForm.elements["username"].value;
  let password = registerForm.elements["password"].value;
  let supplier = registerForm.elements["companyname"].value;

  let passwordConfirm = registerForm.elements["confirm-password"].value;
    
  console.log(username);
  // check that passwords are the same
  if (password !== passwordConfirm) {
    alert("Passwords must match!");
    return;
  } else {
    // send username and password to the server
    try {
        //The only difference in this script is that we post to a different link
      let response = await axios.post("/register_supplier", {
        username,
        password,
        supplier
      });

      if (response.data.wasSuccess) {
        // user created
        alert("Account created! Navigate to the login page and sign in!!");
        registerForm.reset();
      } else {
        // username already in use
        alert("username already in use!");
        registerForm.reset();
      }
    } catch (err) {
      alert("Error: An error has occurred");
    }
  }
});