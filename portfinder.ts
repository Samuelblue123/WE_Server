import app from "./app.ts";

const server = app.listen(0, () => {
    console.log(`Listening on port ${server.address().port}`);
});