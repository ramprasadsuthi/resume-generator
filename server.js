const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-resume', async (req, res) => {
  const {
    firstName, lastName, email, phone, school, degree, fieldOfStudy,
    startDate, endDate, company, jobTitle, jobStartDate, jobEndDate, jobDescription, skills
  } = req.body;

  const htmlContent = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 20px; }
            h1 { text-align: center; }
            .section { margin-bottom: 20px; }
            .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .section p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Resume</h1>
            <div class="section">
                <h2>Personal Information</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
            </div>
            <div class="section">
                <h2>Education</h2>
                <p><strong>School/University:</strong> ${school}</p>
                <p><strong>Degree:</strong> ${degree}</p>
                <p><strong>Field of Study:</strong> ${fieldOfStudy}</p>
                <p><strong>Start Date:</strong> ${startDate}</p>
                <p><strong>End Date:</strong> ${endDate}</p>
            </div>
            <div class="section">
                <h2>Work Experience</h2>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Job Title:</strong> ${jobTitle}</p>
                <p><strong>Start Date:</strong> ${jobStartDate}</p>
                <p><strong>End Date:</strong> ${jobEndDate}</p>
                <p><strong>Description:</strong> ${jobDescription}</p>
            </div>
            <div class="section">
                <h2>Skills</h2>
                <p>${skills}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,  // Disable timeout
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
