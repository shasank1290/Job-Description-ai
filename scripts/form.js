document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resumeForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const jobDescription = form.jobDescription.value;
    const resume = form.resume.files[0];

    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = reader.result.split(',')[1];

      try {
        const response = await fetch("https://qwert12.app.n8n.cloud/webhook-test/resume-submission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            jobDescription,
            resumeName: resume.name,
            resumeType: resume.type,
            resumeFile: base64String
          })
        });

        if (response.ok) {
          alert("Form submitted successfully!");
          form.reset();
        } else {
          const errorText = await response.text();
          alert("Submission failed: " + errorText);
        }

      } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred while submitting the form.");
      }
    };

    reader.readAsDataURL(resume);
  });
});
