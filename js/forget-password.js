let baseUrl = "https://ecommerce.routemisr.com";
let btn = document.getElementById("verify-btn");
let errorMsg = document.getElementById("error-msg");
let emailInput = document.getElementById("email");
let codeInput = document.getElementById("code");
let passwordInput = document.createElement("input");
passwordInput.type = "password";
passwordInput.className = "form-control mb-3 hidden";
passwordInput.placeholder = "New Password";
passwordInput.id = "new-password";
let confirmPasswordInput = document.createElement("input");
confirmPasswordInput.type = "password";
confirmPasswordInput.className = "form-control mb-3 hidden";
confirmPasswordInput.placeholder = "Confirm New Password";
confirmPasswordInput.id = "confirm-password";
let form = document.getElementById("verify-form");
form.insertBefore(passwordInput, btn);
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
form.insertBefore(confirmPasswordInput, btn);
btn.addEventListener("click", handleSendCode);
async function handleSendCode(e) {
  e.preventDefault();
  let email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
  if (!emailRegex.test(email)) {
    showError("Invalid Email");
    return;
  }
  try {
    let response = await fetch(`${baseUrl}/api/v1/auth/forgotPasswords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    let data = await response.json();

    if (response.ok) {
      showSuccess("Code sent to your email.");

      emailInput.classList.add("fade-out");
      setTimeout(() => {
        emailInput.classList.add("hidden");
        emailInput.classList.remove("fade-out");

        codeInput.classList.remove("hidden");
        codeInput.classList.add("fade-in");
      }, 500);

      btn.innerText = "Verify Code";
      btn.removeEventListener("click", handleSendCode);
      btn.addEventListener("click", handleVerifyCode);
    } else {
      showError(data.message || "Failed to send code.");
    }
  } catch (err) {
    console.error(err);
    showError("Something went wrong.");
  }
}

async function handleVerifyCode(e) {
  e.preventDefault();
  let code = codeInput.value.trim();

  if (!code) {
    showError("Please enter the code.");
    return;
  }

  try {
    let response = await fetch(`${baseUrl}/api/v1/auth/verifyResetCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetCode: code }),
    });

    let data = await response.json();

    if (response.ok) {
      showSuccess("Code verified! Enter new password.");

      codeInput.classList.add("fade-out");
      setTimeout(() => {
        codeInput.classList.add("hidden");
        codeInput.classList.remove("fade-out");
        passwordInput.classList.remove("hidden");
        passwordInput.classList.add("fade-in");

        confirmPasswordInput.classList.remove("hidden");
        confirmPasswordInput.classList.add("fade-in");
      }, 500);

      btn.innerText = "Reset Password";
      btn.removeEventListener("click", handleVerifyCode);
      btn.addEventListener("click", handleResetPassword);
    } else {
      showError(data.message || "Invalid or expired code.");
    }
  } catch (err) {
    console.error(err);
    showError("Error verifying code.");
  }
}

async function handleResetPassword(e) {
  e.preventDefault();
  let newPassword = passwordInput.value.trim();
  let confirmPassword = confirmPasswordInput.value.trim();
  let email = emailInput.value.trim();

  if (!passwordRegex.test(newPassword)) {
    showError("Invalid Password");;
    return;
  }

  if (newPassword !== confirmPassword) {
    showError("Passwords do not match.");
    return;
  }

  try {
    let response = await fetch(`${baseUrl}/api/v1/auth/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        newPassword,
      }),
    });

    let data = await response.json();

    if (response.ok) {
      showSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      showError(data.message || "Failed to reset password.");
    }
  } catch (err) {
    console.error(err);
    showError("Something went wrong.");
  }
}
function showError(message) {
  errorMsg.innerText = message;
  errorMsg.classList.remove("text-success");
  errorMsg.classList.add("text-danger");
}

function showSuccess(message) {
  errorMsg.innerText = message;
  errorMsg.classList.remove("text-danger");
  errorMsg.classList.add("text-success");
}
