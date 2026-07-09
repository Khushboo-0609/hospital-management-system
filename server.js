const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {

    // Home Page
    if (req.url === "/") {

        fs.readFile("index.html", (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Error Loading Page");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

    }

    // CSS
    else if (req.url === "/style.css") {

        fs.readFile("style.css", (err, data) => {

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            res.end(data);
        });

    }

    // Hospital Image
    else if (req.url === "/images.jpeg") {

        fs.readFile("images.jpeg", (err, data) => {

            if (err) {
                res.writeHead(404);
                res.end("Image Not Found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "image/jpeg"
            });

            res.end(data);

        });

    }

    // Background Image
    else if (req.url === "/images2.jpeg") {

        fs.readFile("images2.jpeg", (err, data) => {

            if (err) {
                res.writeHead(404);
                res.end("Image Not Found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "image/jpeg"
            });

            res.end(data);

        });

    }

    // Register Patient
    else if (req.url.startsWith("/register")) {

        const query = url.parse(req.url, true).query;

        let patients = [];

        try {

            patients = JSON.parse(
                fs.readFileSync("patients.json", "utf8")
            );

        } catch {

            patients = [];

        }

        patients.push({

            id: Date.now(),

            name: query.name,

            age: query.age,

            gender: query.gender,

            phone: query.phone,

            disease: query.disease,

            admitDate: query.date

        });

        fs.writeFileSync(

            "patients.json",

            JSON.stringify(patients, null, 2)

        );

        res.writeHead(200, {

            "Content-Type": "text/html"

        });

        res.end(`
        <div class="success">

        <h2>✅ Patient Registered Successfully</h2>

        <br>

        <a href="/">Register Another Patient</a>

        <br><br>

        <a href="/view">View Patients</a>

        </div>
        `);
        }
        // View Patients
    else if (req.url.startsWith("/view"))
     {

        let patients = [];

        try {

            patients = JSON.parse(
                fs.readFileSync("patients.json", "utf8")
            );

        } catch {

            patients = [];

        }

        const query = url.parse(req.url, true).query;

        const search = (query.search || "").toLowerCase();

        const disease = (query.disease || "").toLowerCase();

        const date = query.date || "";

        let filteredPatients = patients.filter((p) => {

            const matchName =
                p.name.toLowerCase().includes(search);

            const matchDisease =
                disease === "" ||
                p.disease.toLowerCase().includes(disease);

            const matchDate =
                date === "" ||
                p.admitDate === date;

            return matchName &&
                   matchDisease &&
                   matchDate;

        });

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        let output = `

<!DOCTYPE html>

<html>

<head>

<title>Patient Records</title>

<link rel="stylesheet" href="/style.css">

</head>

<body>

<h1>Patient Records</h1>

<div class="total">
Total Patients : ${filteredPatients.length}
</div>

<form class="search-box" action="/view" method="GET">

<input
type="text"
name="search"
placeholder="Search by Name">

<input
type="text"
name="disease"
placeholder="Filter by Disease">

<input
type="date"
name="date">

<button type="submit">
Search
</button>

</form>

<div class="cards">
`;

        if (filteredPatients.length === 0) {

            output += `
            <h2 style="text-align:center;color:red;width:100%;">
                No Patient Found
            </h2>
            `;

        } else {

            filteredPatients.forEach((p) => {

                output += `

<div class="card">

<h2>${p.name}</h2>

<p><b>Age:</b> ${p.age}</p>

<p><b>Gender:</b> ${p.gender}</p>

<p><b>Phone:</b> ${p.phone}</p>

<p><b>Disease:</b> ${p.disease}</p>

<p><b>Admit Date:</b> ${p.admitDate}</p>

<a class="delete-btn"
href="/delete?id=${p.id}">
Delete Patient
</a>

</div>

`;

            });

        }
        output += `
</div>

<div class="back">
    <a href="/">⬅ Back to Registration</a>
</div>

</body>
</html>
`;

        res.end(output);

    }

    // Delete Patient
    else if (req.url.startsWith("/delete")) {

        const query = url.parse(req.url, true).query;

        let patients = [];

        try {

            patients = JSON.parse(
                fs.readFileSync("patients.json", "utf8")
            );

        } catch {

            patients = [];

        }

        patients = patients.filter(
            (p) => p.id != query.id
        );

        fs.writeFileSync(
            "patients.json",
            JSON.stringify(patients, null, 2)
        );

        res.writeHead(302, {
            Location: "/view"
        });

        res.end();

    }

    // 404 Page
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end(`
        <h1 style="text-align:center;color:red;margin-top:50px;">
            404 - Page Not Found
        </h1>

        <div style="text-align:center;">
            <a href="/">Go Back Home</a>
        </div>
        `);

    }

});

server.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});
