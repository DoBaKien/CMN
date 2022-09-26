const express = require("express");
const multer = require("multer");
const data = require("./store");
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
const upload = multer();
const port = 3000;

app.use(express.static("./templates"));
app.set("view engine", "ejs");
app.set("views", "./templates");

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  SecretAccessKey: process.env.aws_secret_access_key,
  region: process.env.aws_region,
});
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "SanPham1";

app.get("/", (req, res) => {
  const params = {
    TableName: tableName,
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      return res.send("error " + err);
    } else {
    
      return res.render("index", { data: data.Items });
    }
  });
});

app.post("/", upload.fields([]), (req, res) => {
  console.log("req.body =", req.body);
  const { MaSp, TenSp } = req.body;
  const params = {
    TableName: tableName,
    Item: {
      MaSp,
      TenSp,
    },
  };
  docClient.put(params, (err,data)=>{
    if(err){
      return res.send("error " + err)
    } else {
      return res.redirect("/")
    }
  });
});

app.post("/delete", upload.fields([]),(req,res)=>{
  const { MaSp } = req.body;
  const params = {
    TableName: tableName,
    Key: {
      MaSp,
    },
  };
  docClient.delete(params, (err,data)=>{
    if(err){
      return res.send("error " + err)
    } else {
      return res.redirect("/")
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
