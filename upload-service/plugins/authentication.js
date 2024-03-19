const jwt = require("jsonwebtoken");
const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    fastify.decorate("authenticate", (request, response) => {
        try {
            if (request.url.includes('health')) {
                return;
            }
            const [_, token] = (request.headers.authorization ?? "").split(" ");
            if (!token) {
                return response.status(401).send({ message: "Authorization token required" });
            }
            const data = jwt.verify(token, process.env.NEXTAUTH_SECRET)
            request.user = data;
        } catch (e) {
            return response.status(401).send({ message: e.message });
        }
    });
});
