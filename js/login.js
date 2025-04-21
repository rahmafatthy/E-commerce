let loginBtn=document.getElementById("login-btn");
let baseUrl = "https://ecommerce.routemisr.com";
let errorMsg = document.getElementById("error-msg");
loginBtn.addEventListener("click",async(error)=>{
error.preventDefault();
let errorList=[];
let email=document.getElementById("email").value.trim();
let password=document.getElementById("password").value;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
if(!emailRegex.test(email)){
errorList.push("Invalid Email");
}
if(!passwordRegex.test(password)){
    errorList.push("Invalid Password")
}
try{
let response=await fetch(`${baseUrl}/api/v1/auth/signin`,{
    method:"POST",
    headers: {
        "Content-Type": "application/json",
      },
    body:JSON.stringify({
        email,
        password
    }),
});
let data=await response.json();

if (response.ok) {
    errorMsg.innerHTML = `<p class="text-success">Registration successful! 🎉</p>`;
    document.getElementById("register-form").reset();
  } else {
    errorMsg.innerHTML = `<p class="text-danger">${data.message || "Registration failed."}</p>`;
  }
} catch (err) {
  errorMsg.innerHTML = `<p class="text-danger">Something went wrong. Please try again.</p>`;
  console.error(err);
}
});