const user = "paulina.ludwig@ui.com/token";
const token = "35tMQ7S2IfKMcKHClqygak606JIlrDwKcDMkqBDc";
const auth = Buffer.from(user + ':' + token).toString("base64");

console.log("auth", auth);
