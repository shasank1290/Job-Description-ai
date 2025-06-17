const form = document.getElementById("resumeForm");
const formContainer = document.getElementById("form-container");
const spinner = document.getElementById("loading-spinner");
const resultContainer = document.getElementById("result-container");

if (form && spinner && resultContainer) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Hide form
    formContainer.style.display = "none";

    // Show spinner
    spinner.style.display = "block";

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Submission failed: " + errorText);
      }

      const res = await response.json();
      console.log("Result from N8N:", res);

      setTimeout(() => {
        spinner.style.display = "none";
        resultContainer.style.display = "block";

        resultContainer.innerHTML = `
          <div style="background:#f0f8ff; padding:15px; border-radius:8px; margin-bottom: 15px;">
            <h3>📊 Match Score</h3>
            <p style="font-size: 24px; font-weight: bold;">${res.match_score ?? "N/A"}%</p>
          </div>

          <div style="background:#e6ffe6; padding:15px; border-radius:8px; margin-bottom: 15px;">
            <h3>✅ Matched Skills</h3>
            <p>${(res.matched_skills ?? []).join(", ") || "N/A"}</p>
          </div>

          <div style="background:#fff3cd; padding:15px; border-radius:8px; margin-bottom: 15px;">
            <h3>⚠️ Missing Skills</h3>
            <p>${(res.missing_skills ?? []).join(", ") || "N/A"}</p>
          </div>

          <div style="background:#e8f4fc; padding:15px; border-radius:8px; margin-bottom: 15px;">
            <h3>🧠 Summary</h3>
            <p>${res.summary || "No summary available"}</p>
          </div>

          <div style="background:#ffe6f0; padding:15px; border-radius:8px;">
            <h3>🔧 Suggestions</h3>
            <ul>${(res.improvement_points ?? []).map(p => `<li>${p}</li>`).join("") || "<li>None</li>"}</ul>
          </div>
        `;
      }, 3000); // 3 seconds delay

    } catch (error) {
      spinner.style.display = "none";
      resultContainer.style.display = "block";
      resultContainer.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
      console.error(error);
    }
  });
}
