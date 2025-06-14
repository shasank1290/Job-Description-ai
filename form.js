document.getElementById("resumeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const jobDescription = form.jobDescription.value;
  const resume = form.resume.files[0];

  const reader = new FileReader();
  reader.onload = async function () {
    const base64String = reader.result.split(',')[1]; // strip data URL header

    const response = await fetch("YOUR_WEB_APP_URL", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone,
        jobDescription,
        resumeName: resume.name,
        resumeType: resume.type,
        resumeFile: base64String
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      alert("Form submitted successfully!");
      form.reset();
    } else {
      alert("Submission failed.");
    }
  };

  reader.readAsDataURL(resume);
});
