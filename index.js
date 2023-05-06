const http = require("http");
const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Enter the path to the template file: ", (templatePath) => {
  readline.question("Enter the path to the data file: ", (dataPath) => {
    templatePath = "./views/index.html";
    dataPath = "data.json";

    let template, data;
    try {
      template = fs.readFileSync(templatePath, "utf8");
      data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    } catch (err) {
      console.error("Error loading files:", err.message);
      readline.close();
      return;
    }

    const server = http.createServer((req, res) => {
      console.log(req.url);

      let filePath = path.join(
        __dirname,
        "views",
        req.url === "/" ? "/index.html" : req.url
      );

      let extName = path.extname(filePath);
      let contentType = extName === ".css" ? "text/css" : "text/html";

      res.setHeader("Content-Type", contentType);
      let rendered = fs.readFileSync(filePath);

      if (req.url === "/") {
        try {
          rendered = Mustache.render(template, data);
        } catch (err) {
          console.error("Error rendering template:", err.message);
          res.statusCode = 500;
          res.end("Internal server error");
          return;
        }
      }

      res.end(rendered);
    });

    server.on("error", (err) => {
      console.error("Server error:", err.me);
    });

    server.listen(3000, () => {
      console.log("Server listening on http://localhost:3000");
    });
    readline.close();
  });
});
