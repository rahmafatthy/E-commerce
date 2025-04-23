let loginBtn = document.getElementById("login-btn");
let baseUrl = "https://ecommerce.routemisr.com";
let errorMsg = document.getElementById("error-msg");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  let errorList = [];
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!emailRegex.test(email)) {
    errorList.push("Invalid Email");
  }

  if (!passwordRegex.test(password)) {
    errorList.push("Invalid Password");
  }

  if (errorList.length > 0) {
    errorMsg.innerHTML = errorList.map(err => `<p class="text-danger">${err}</p>`).join("");
    return;
  }

  try {
    let response = await fetch(`${baseUrl}/api/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data = await response.json();

    if (response.ok) {
      const userData = {
        token: data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      window.location.replace("index.html");
    } else {
      errorMsg.innerHTML = `<p class="text-danger">${data.message || "Login failed."}</p>`;
    }
  } catch (err) {
    errorMsg.innerHTML = `<p class="text-danger">Something went wrong. Please try again.</p>`;
    console.error(err);
  }
});
