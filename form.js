document.getElementById("resumeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = document.getElementById("resumeForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
    
      const formData = new FormData(form);
      const webhookURL = "https://your-n8n-domain.com/webhook/resume-collector";
    
      try {
        const response = await fetch(webhookURL, {
          method: "POST",
          body: formData
        });
    
        if (response.ok) {
          window.location.href = `results.html?email=${formData.get("email")}`;
        } else {
          alert("Error submitting the form");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Server Error");
      }
    });
    
