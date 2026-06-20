const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading page");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

    } else if (req.url === "/style.css") {
    fs.readFile("style.css", (err, data) => {
        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.end(data);
    });
}
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
            name: query.name,
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
            <h2>Patient Registered Successfully</h2>
            <a href="/">Go Back</a>
            <br><br>
            <a href="/view">View Patients</a>
        `);

    } else if (req.url === "/view") {

        let patients = [];

        try {
            patients = JSON.parse(
                fs.readFileSync("patients.json", "utf8")
            );
        } catch {
            patients = [];
        }

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        let output = "<h1>Patient Records</h1>";

        patients.forEach((p, index) => {
            output += `
                <p>
                    <b>Patient ${index + 1}</b><br>
                    Name: ${p.name}<br>
                    Disease: ${p.disease}<br>
                    Admit Date: ${p.admitDate}
                </p>
                <hr>
            `;
        });

        output += `<a href="/">Back to Form</a>`;

        res.end(output);

    } else {
        res.writeHead(404);
        res.end("Page Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
