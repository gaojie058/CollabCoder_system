const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

require('dotenv').config();

const authenticate = require('./middleware/authenticate');
const middlewares = require('./middlewares');


const app = express();

// app.use(cors({origin:'*'}));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// 不需要验证token的接口
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/autoLogin", require("./routes/autoLogin"));

// 验证token的中间件
// app.use(authenticate);

// 需要验证token的接口
app.use("/document", require("./routes/document"));
app.use("/projects", require("./routes/projects"));
app.use("/project", require("./routes/project"));
app.use("/profile", require("./routes/profile"));
app.use("/addproject", require("./routes/add_project"));
app.use("/edit", require("./routes/edit"));
app.use("/stats", require("./routes/stats"));
app.use("/users", require("./routes/users"));
app.use("/summary", require("./routes/summary"));
app.use("/decision", require("./routes/decision"));
app.use("/codegroup", require("./routes/codegroup"));

// 错误拦截中间件
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

process.on('uncaughtException', function (err) {
  console.log("uncaughtException" + err);
})

module.exports = app;
