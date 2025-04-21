let registerBtn = document.getElementById("register-btn");
let baseUrl = "https://ecommerce.routemisr.com";
let errorMsg = document.getElementById("error-msg");

registerBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirm-password").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  let errors = [];
  if (name.length < 3) {
    errors.push("Name must be at least 3 letters");
  }
  if (!emailRegex.test(email)) {
    errors.push("Enter valid email address");
  }
  if (!phoneRegex.test(phone)) {
    errors.push("Enter valid phone number");
  }
  if (!passwordRegex.test(password)) {
    errors.push(
      "Password must be at least 8 characters, include upper & lowercase letters, number, and special character."
    );
  }
  if (password !== confirmPass) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    errorMsg.innerHTML = `<p class="text-danger">${errors.join("<br>")}</p>`;
    return;
  }
  try {
    let response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        rePassword: confirmPass, 
        phone,
      }),
    });

    const data = await response.json();

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
