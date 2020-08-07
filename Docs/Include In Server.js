const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const exphbs = require("express-handlebars");

const swaggerUi = require("swagger-ui-express");

app.use(morgan("short"));
//app.use(morgan("combined"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

//use swagger-Ui-express for your app documentation endpoint

// If you are using .json file
const openApiDocumentation = require("./docs/swagger");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// End of Swagger UI Part

require("./passport");
require("./routes/api")(app);

app.get("*", (req, res) => {
  console.log("unhandled GET request");
  res.status(403).send("unhandled GET request");
});

app.post("*", (req, res) => {
  console.log("unhandled POST request");
  res.status(403).send("unhandled POST request");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
