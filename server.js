const bodyParser = require("body-parser");
const express = require("express")
const path = require("path")
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const app = express()
app.use(express.json())
app.use(express.static("public"))

function getData() {
    const data = fs.readFileSync("./db/db.json", (err) => {
        if(err) throw err;
    })
    const parsedData = JSON.parse(data)
    return parsedData
}

//HTML ROUTES/
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"))
})

// API ROUTES
app.get("/api/notes", (rez, res) => {
    res.sendFile(path.join(__dirname, "db", "db.json"))
})

app.post("/api/notes", (req, res) => {
    const requestBody = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    }
    const data = getData()
    data.push(requestBody)
    console.log(data)
    fs.writeFile("./db/db.json", JSON.stringify(data), (err) => {
        if(err) throw err;
    })
    res.json(parsedData)
})

app.delete("/api/notes/:id", (req, res) => {
    const data = getData()
    const filteredData = data.filter(item => item.id != req.params.id)
    fs.writeFile("./db/db.json", JSON.stringify(filteredData), (err) => {
        if(err) throw err;
    })
    console.log(filteredData)
    res.json(filteredData)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log( `server running on port ${PORT}` ))