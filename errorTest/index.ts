import http from "http";
import fetch from "cross-fetch";

function incomingMessage(req: http.IncomingMessage, res: http.ServerResponse) {
  switch (req.url) {
    case "/error":
      res.setHeader("Content-Type", "application/json");
      res.write(
        JSON.stringify({
          error: "On Purpose!",
        })
      );
      res.statusCode = 500;
      break;
    case "/success":
      res.setHeader("Content-Type", "application/json");
      res.write(
        JSON.stringify({
          success: true,
        })
      );
      res.statusCode = 200;
      break;
    default:
      res.setHeader("Content-Type", "text/html");
      res.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title> Default </title>
          </head>
          <body>
            <h1> Default Response </h1>
          </body>
        </html>
      `);
      res.statusCode = 200;
  }

  res.end();
}

function startServer() {
  return http.createServer(incomingMessage).listen(4000);
}

async function success() {
  const successReq = await fetch("http://localhost:4000/success");
  const successJSON = await successReq.json();

  if (successJSON.success) {
    return;
  }

  throw new Error("Invalid data recieved");
}

async function failed() {
  const failedReq = await fetch("http://localhost:4000/error");
  const failedJSON = await failedReq.json();

  if (failedJSON.error) {
    return;
  }

  throw new Error("Something happened");
}

async function nonAwaitedThrow() {
  console.log("Running non-awaited");
  try {
    const ignoredReq = fetch("http://localhost:4000/error");
  } catch (e) {
    console.error(e);
  }
  console.log("Non-await finished");
}

function properIgnore() {
  fetch("http://localhost:4000/error").catch(console.error);
}

async function runTest() {
  const server = startServer();

  properIgnore();
  await success();
  await failed();
  await nonAwaitedThrow();

  server.close();
}

runTest();
