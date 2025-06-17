const form = document.getElementById("resumeForm");
const resultContainer = document.getElementById("result-container");

if (form && resultContainer) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Show loading message
    resultContainer.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <p>⏳ Analyzing your resume... Please wait.</p>
      </div>
    `;

    const formData = new FormData();
    formData.append("name", form.name.value);
    formData.append("email", form.email.value);
    formData.append("phone", form.phone.value);
    formData.append("jobDescription", form.jobDescription.value);
    formData.append("resumeFile", form.resume.files[0]);

  try {
  const response = await fetch("https://qwert12.app.n8n.cloud/webhook/43bac734-875e-4d16-9630-6257042a93b6", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  console.log("Response from n8n:", result);

  // Wait for 2 seconds before showing result box
  setTimeout(() => {
    resultContainer.innerHTML = `
      <div style="background:#f0f8ff; padding:15px; border-radius:8px; margin-bottom: 15px;">
        <h3>📊 Match Score</h3>
        <p style="font-size: 24px; font-weight: bold;">${result.match_score || "N/A"}%</p>
      </div>

      <div style="background:#e6ffe6; padding:15px; border-radius:8px; margin-bottom: 15px;">
        <h3>✅ Matched Skills</h3>
        <p>${(result.matched_skills || []).join(", ") || "N/A"}</p>
      </div>

      <div style="background:#fff3cd; padding:15px; border-radius:8px; margin-bottom: 15px;">
        <h3>⚠️ Missing Skills</h3>
        <p>${(result.missing_skills || []).join(", ") || "N/A"}</p>
      </div>

      <div style="background:#e8f4fc; padding:15px; border-radius:8px; margin-bottom: 15px;">
        <h3>🧠 Summary</h3>
        <p>${result.summary || "No summary available"}</p>
      </div>

      <div style="background:#ffe6f0; padding:15px; border-radius:8px;">
        <h3>🔧 Suggestions</h3>
        <ul>${(result.improvement_points || []).map(p => `<li>${p}</li>`).join("")}</ul>
      </div>
    `;
  }, 2000); // Wait for 2000 ms (2 sec)

  form.reset();
} catch (error) {
  resultContainer.innerHTML = `<div style="color:red;">❌ ${error.message}</div>`;
  console.error(error);
}
