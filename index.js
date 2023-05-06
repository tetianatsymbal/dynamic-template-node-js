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
    // Load the template file and the data file
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

    // Create a server that renders the template with the data
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

      // Send the rendered HTML to the client
      res.end(rendered);
    });

    server.on("error", (err) => {
      console.error("Server error:", err.me);
    });

    // Start the server on port 3000
    server.listen(3000, () => {
      console.log("Server listening on http://localhost:3000");
    });

    // Close the readline interface
    readline.close();
  });
});

// const server = http.createServer((req, res) => {
//   if (req.url === "/") {

//     // Read the template file
//     fs.readFile(templatePath, "utf8", (err, template) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "text/plain" });
//         res.end(`Error reading template file: ${err.message}`);
//         return;
//       }

//       // Read the data file
//       fs.readFile(dataPath, "utf8", (err, data) => {
//         if (err) {
//           res.writeHead(500, { "Content-Type": "text/plain" });
//           res.end(`Error reading data file: ${err.message}`);
//           return;
//         }

//         try {
//           // Parse the data as JSON
//           const dataObj = JSON.parse(data);

//           // Render the template with the data object
//           const rendered = ejs.render(template, dataObj);

//           // Send the rendered HTML to the client
//           res.writeHead(200, { "Content-Type": "text/html" });
//           res.end(rendered);
//         } catch (err) {
//           res.writeHead(500, { "Content-Type": "text/plain" });
//           res.end(`Error rendering template: ${err.message}`);
//         }
//       });
//     });
//   } else {
//     // Handle 404 Not Found error
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("404 Not Found");
//   }
// });

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server listening on http://localhost:${port}`);
// });
