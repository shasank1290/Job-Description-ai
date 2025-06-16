document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const jobDescription = form.jobDescription.value;
  const resumeFile = form.resume.files[0];

  const reader = new FileReader();
  reader.onload = async function () {
    const base64Resume = reader.result.split(",")[1];

    const body = {
      name,
      email,
      phone,
      jobDescription,
      resumeFile: base64Resume
    };

    const response = await fetch("https://qwert12.app.n8n.cloud/webhook/resume-submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const resultDiv = document.getElementById("result");

    try {
      const data = await response.json();
      resultDiv.innerHTML = `
        <h3>Match Score: ${data.match_score}%</h3>
        <p><strong>Matched Skills:</strong> ${data.matched_skills.join(", ")}</p>
        <p><strong>Missing Skills:</strong> ${data.missing_skills.join(", ")}</p>
        <p><strong>Suggestions:</strong></p>
        <ul>${data.improvement_points.map(p => `<li>${p}</li>`).join("")}</ul>
        <p><strong>Summary:</strong> ${data.summary}</p>
      `;
    } catch (error) {
      resultDiv.innerHTML = "Something went wrong. Please try again.";
      console.error(error);
    }
  };

  reader.readAsDataURL(resumeFile);
});
