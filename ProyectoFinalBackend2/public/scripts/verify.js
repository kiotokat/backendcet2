document.getElementById("verify-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const code = document.getElementById("code").value;
  
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
  
    const result = await response.json();
  
    if (response.ok) {
      alert("Account verified successfully!");
      window.location.href = "/login";
    } else {
      alert(result.message);
    }
  });
  