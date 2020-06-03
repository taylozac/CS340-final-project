const passForm = document.forms["register-form"];

passForm.addEventListener("submit"< async (event) => {
    event.preventDefault();
    
    let username = passForm.elements["username"].value;
    let password = passForm.elements["password"].value;
    let confirm = = passForm.elements["confirm-password"].value;
  if (password !== confirm) {
    alert("Passwords must match!");
    return;
  }else{
    try{
       let response = await axios.post("/change_password", {
        username,
        password,
      });
        
       if(!response.data.wasSuccess) {
        alert("Something went wrong with changing your password, try again later!");
        registerForm.reset();
      }    
        
    }catch (err) {
      alert("Error: An error has occurred");
    }
  }
});