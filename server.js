const app = require("./app");
const { httpServer } = require("./app");


const PORT = process.env.PORT || 5005;

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
