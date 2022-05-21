const Fastify = require("fastify");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
// dotenv is required to read data from .env file

const prisma = new PrismaClient();

const getSignedToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.post(
  "/api/v1/auth/register",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
          role: { type: "string" },
        },
      },
    },
  },
  async (request, reply) => {
    let { username, password, role } = request.body;
    if (
      typeof username !== "string" ||
      !/^[a-zA-Z0-9\-_]{3,30}$/.test(username)
    ) {
      reply.status(400);
      reply.send({ success: false, error: "Invalid username!" });
    }
    if (typeof password !== "string" || !(10 <= password.length)) {
      reply.status(400);
      reply.send({ success: false, error: "Invalid password!" });
    }
    if (role === "student") {
      role = "Student";
    } else if (role === "teacher") {
      role = "Teacher";
    } else {
      reply.status(400);
      reply.send({ success: false, error: "Invalid role!" });
    }
    const existing = await prisma.user.count({
      where: { username },
    });
    if (existing) {
      reply.status(409);
      reply.send({ success: false, error: "Username already exist!" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const { id } = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
      },
      select: {
        id: true,
      },
    });
    reply.send({ success: true, token: getSignedToken(id) });
  }
);

fastify.post(
  "/api/v1/auth/login",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  },
  async (request, reply) => {
    const { username, password } = request.body;
    const user = prisma.user.findUnique({
      where: { username },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      reply.status(404);
      reply.send({ success: false, error: "Username not found!" });
    }
    const { id, passwordHash } = user;
    const matches = bcrypt.compare(password, passwordHash);
    if (!matches) {
      reply.status(403);
      reply.send({ success: false, error: "Wrong password!" });
    }
    reply.send({ success: true, token: getSignedToken(id) });
  }
);

fastify.setErrorHandler(function (error, request, reply) {
  fastify.log.error(error);
  console.error(error);
  reply.status(500).send({ error: "an error occured" });
});

const start = async () => {
  try {
    await fastify.listen(8080);
    console.log(`Server running at port 8080`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
