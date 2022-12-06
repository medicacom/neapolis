// Importing the packages required for the project.
// {alter:true }
const express = require("express");
var app = express();
const path = require("path");
app.use("/new", express.static("./new"));

var cors = require("cors");
/* const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");
    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i+10);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info); 
    });
});

db.close(); */

app.use(cors());

app.use(express.static(path.join(__dirname, "../client/build")));
// Used for sending the Json Data to Node API
app.use(express.json());

app.use("/role/", require("./controller/roleController"));
app.use("/user/", require("./controller/userController"));
app.use("/settings/", require("./controller/settingsController"));
app.use("/notification/", require("./controller/notificationController"));
app.use("/root/", require("./controller/rootController"));
app.use("/annee/", require("./controller/anneeController"));
app.use("/offline/", require("./controller/offlineController"));
app.use("/news/", require("./controller/newsController"));
app.use("/voix_administration/", require("./controller/voix_administrationController"));
app.use("/indication/", require("./controller/indicationController"));
app.use("/gouvernorat/", require("./controller/gouvernoratController"));
app.use("/effet_indesirable/", require("./controller/effet_indesirableController"));
app.use("/medicament/", require("./controller/medicamentController"));
app.use("/specialite/", require("./controller/specialiteController"));
app.use("/age/", require("./controller/ageController"));
app.use("/declaration/", require("./controller/declarationController"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = 4000 || 5000 || 6000;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`app listening on port ${PORT}!`)
);
