document.getElementById("resumeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const jobDescription = form.jobDescription.value;
  const resume = form.resume.files[0];

  // Read PDF file as ArrayBuffer
  const reader = new FileReader();
  reader.onload = async function () {
    const typedArray = new Uint8Array(reader.result);

    try {
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let extractedText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(" ");
        extractedText += text + "\n";
      }

      // Send data to webhook
      const response = await fetch("https://webhook-test.com/16de1dc8c594e540bed47d916ef474e8", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          jobDescription,
          resumeText: extractedText
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

    } catch (error) {
      console.error("PDF Parsing error:", error);
      alert("Could not extract text from PDF.");
    }
  };

  reader.readAsArrayBuffer(resume);
});
