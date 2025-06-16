document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const jobDescription = form.jobDescription.value;
  const resumeFile = form.resume.files[0];

  const loading = document.getElementById("loading");
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // Clear old result
  loading.style.display = "block"; // Show spinner

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

    try {
      const response = await fetch("https://qwert12.app.n8n.cloud/webhook/resume-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      const matchedSkills = data.matched_skills ?? [];
      const missingSkills = data.missing_skills ?? [];
      const suggestions = data.improvement_points ?? [];
      const summary = data.summary ?? "No summary provided.";
      const matchScore = data.match_score ?? "N/A";

      resultDiv.innerHTML = `
        <div style="border: 2px solid #333; padding: 20px; border-radius: 12px; background-color: #fdfdfd; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
            <h3>🎯 Match Score</h3>
            <p>${matchScore}%</p>
          </div>

          <div style="border: 1px solid #cce5ff; padding: 15px; margin-bottom: 15px; border-radius: 8px; background-color: #eaf4ff;">
            <h3>✅ Matched Skills</h3>
            <p>${matchedSkills.length ? matchedSkills.join(", ") : "No matched skills found."}</p>
          </div>

          <div style="border: 1px solid #f8d7da; padding: 15px; margin-bottom: 15px; border-radius: 8px; background-color: #fff5f5;">
            <h3>❌ Missing Skills</h3>
            <p>${missingSkills.length ? missingSkills.join(", ") : "No missing skills listed."}</p>
          </div>

          <div style="border: 1px solid #d4edda; padding: 15px; margin-bottom: 15px; border-radius: 8px; background-color: #f1fff1;">
            <h3>🛠 Suggestions</h3>
            <ul>
              ${suggestions.length ? suggestions.map(p => `<li>${p}</li>`).join("") : "<li>No suggestions available.</li>"}
            </ul>
          </div>

          <div style="border: 1px solid #d6d8db; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
            <h3>📝 Summary</h3>
            <p>${summary}</p>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Fetch Error:", error);
      resultDiv.innerHTML = `<p style="color: red;">❌ Something went wrong. Please try again later.</p>`;
    } finally {
      loading.style.display = "none"; // Hide spinner
    }
  };

  reader.readAsDataURL(resumeFile);
});
