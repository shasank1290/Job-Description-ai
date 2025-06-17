const form = document.getElementById("resumeForm");
const formContainer = document.getElementById("form-container");
const spinner = document.getElementById("loading-spinner");
const resultContainer = document.getElementById("result-container");

if (form && spinner && resultContainer) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Show spinner, hide form
    formContainer.style.display = "none";
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

      const result = await response.json();
      console.log("Result from N8N:", result);

      // Wait 2 seconds (simulate processing)
      setTimeout(() => {
        spinner.style.display = "none";
        resultContainer.style.display = "block";

        document.getElementById("matchScore").innerText = `Match Score: ${result.match_score || "N/A"}%`;
        document.getElementById("matchedSkills").innerText = `Matched Skills: ${(result.matched_skills || []).join(", ") || "N/A"}`;
        document.getElementById("missingSkills").innerText = `Missing Skills: ${(result.missing_skills || []).join(", ") || "N/A"}`;
        document.getElementById("summary").innerText = `Summary: ${result.summary || "No summary available"}`;

        document.getElementById("improvementPoints").innerHTML = (result.improvement_points || [])
          .map(p => `<li>${p}</li>`)
          .join("");

      }, 2000); // 2 sec delay

    } catch (error) {
      spinner.style.display = "none";
      resultContainer.style.display = "block";
      resultContainer.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
      console.error(error);
    }
  });
}
