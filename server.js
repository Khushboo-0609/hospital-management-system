const http = require("http");
const fs = require("fs");
const url = require("url");
const { MongoClient } = require("mongodb");

// MongoDB Connection
const mongoUrl = "mongodb+srv://id_db_user:password@cluster0.zhb8wd6.mongodb.net/student?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(mongoUrl);

let patientsCollection;

async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB Connected");

        const db = client.db("student");
        patientsCollection = db.collection("patients");
    } catch (err) {
        console.log(err);
    }
}

connectDB();

// Create Server
const server = http.createServer(async (req, res) => {

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

    }

    else if (req.url === "/style.css") {

        fs.readFile("style.css", (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("CSS File Not Found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            res.end(data);
        });

    }

    else if (req.url.startsWith("/register")) {

        const query = url.parse(req.url, true).query;

        await patientsCollection.insertOne({
            name: query.name,
            age: query.age,
            disease: query.disease,
            admitDate: query.date
        });

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h2>Patient Registered Successfully</h2>
            <a href="/">Go Back</a>
            <br><br>
            <a href="/view">View All Patients</a>
        `);

    }

    else if (req.url === "/view") {

        const patients = await patientsCollection.find().toArray();

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        let output = `
        <html>
        <head>
            <title>Patient Records</title>
        </head>
        <body>
            <h1>Patient Records</h1>
        `;

        patients.forEach((p, index) => {
            output += `
                <p>
                    <b>Patient ${index + 1}</b><br>
                    Name: ${p.name}<br>
                    Age: ${p.age}<br>
                    Disease: ${p.disease}<br>
                    Admit Date: ${p.admitDate}
                </p>
                <hr>
            `;
        });

        output += `
            <a href="/">Back to Form</a>
        </body>
        </html>
        `;

        res.end(output);

    }
    else if (req.url === "/images.jpeg") {
    fs.readFile("images.jpeg", (err, data) => {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.end(data);
    });
}
else if (req.url === "/images2.jpeg") {
    fs.readFile("images2.jpeg", (err, data) => {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.end(data);
    });
}
    else {

        res.writeHead(404);
        res.end("Page Not Found");

    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});