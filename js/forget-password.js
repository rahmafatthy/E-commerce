let baseUrl = "https://ecommerce.routemisr.com";
let btn = document.getElementById("verify-btn");
let errorMsg = document.getElementById("error-msg");
let emailInput = document.getElementById("email");

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  // STEP 1: SEND RESET CODE
  let email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errorMsg.innerText = "Invalid Email";
    errorMsg.classList.add("text-danger");
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
      errorMsg.innerText = "Code sent to your email.";
      errorMsg.classList.remove("text-danger");
      errorMsg.classList.add("text-success");

      // Reveal code input field if hidden
      let codeInput = document.getElementById("code");
      codeInput.classList.remove("d-none");

      // Replace event listener for the next step
      btn.innerText = "Verify Code";
      btn.removeEventListener("click", arguments.callee); // Remove current listener

      btn.addEventListener("click", async function verifyCodeHandler(e) {
        e.preventDefault();
        let code = codeInput.value.trim();

        if (!code) {
          errorMsg.innerText = "Please enter the code.";
          errorMsg.classList.add("text-danger");
          return;
        }

        try {
          let verifyRes = await fetch(`${baseUrl}/api/v1/auth/verifyResetCode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resetCode: code }),
          });

          let verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            errorMsg.innerText = "Code verified successfully!";
            errorMsg.classList.remove("text-danger");
            errorMsg.classList.add("text-success");
            // Optionally: Redirect to reset password form
          } else {
            errorMsg.innerText = verifyData.message || "Invalid code.";
            errorMsg.classList.add("text-danger");
          }
        } catch (err) {
          errorMsg.innerText = "Error verifying code.";
          errorMsg.classList.add("text-danger");
          console.error(err);
        }
      });
    } else {
      errorMsg.innerText = data.message || "Failed to send code.";
      errorMsg.classList.add("text-danger");
    }
  } catch (err) {
    errorMsg.innerText = "Something went wrong.";
    errorMsg.classList.add("text-danger");
    console.error(err);
  }
});
