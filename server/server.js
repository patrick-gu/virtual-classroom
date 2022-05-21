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

const verifySignedToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET).id;
};

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  reply.send({ hello: "world" });
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
      return;
    }
    if (typeof password !== "string" || !(10 <= password.length)) {
      reply.status(400);
      reply.send({ success: false, error: "Invalid password!" });
      return;
    }
    if (role === "student") {
      role = "Student";
    } else if (role === "teacher") {
      role = "Teacher";
    } else {
      reply.status(400);
      reply.send({ success: false, error: "Invalid role!" });
      return;
    }
    const existing = await prisma.user.count({
      where: { username },
    });

    if (existing) {
      reply.status(409);
      reply.send({ success: false, error: "Username already exist!" });
      return;
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
    if (!id) {
      reply.status(500);
      reply.send({ success: false, error: "Failed to create user!" });
      return;
    }
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
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      reply.status(404);
      reply.send({ success: false, error: "Username not found!" });
      return;
    }
    const { id, passwordHash } = user;
    const matches = await bcrypt.compare(password, passwordHash);
    if (!matches) {
      reply.status(403);
      reply.send({ success: false, error: "Wrong password!" });
      return;
    }
    reply.send({ success: true, token: getSignedToken(id) });
  }
);

// User joining the classroom(using name of classroom as code)

fastify.post(
  "/api/v1/classrooms/join",
  {
    schema: {
      headers: {
        properties: {
          authorization: { type: "string" },
        },
        required: ["authorization"],
      },
      body: {
        type: "object",
        properties: {
          code: { type: "string" },
        },
      },
    },
  },
  async (request, reply) => {
    const userId = verifySignedToken(request.headers.authorization);
    const { code } = request.body;
    const {
      id: classroomId,
      name: classroomName,
      users,
      quizzes,
      messages,
    } = await prisma.classroom.findUnique({
      where: { name: code },
      select: { id: true, users: true, messages: true, quizzes: true },
    });
    await prisma.userInClassroom.create({
      data: {
        userId,
        classroomId,
      },
    });

    reply.send({
      success: true,
      classroomName,
      users,
      messages,
      quizzes,
    });
  }
);

// Creating a classroom

fastify.post(
  "/api/v1/classrooms/create",
  {
    schema: {
      headers: {
        properties: {
          authorization: { type: "string" },
        },
        required: ["authorization"],
      },
      body: {
        type: "object",
        properties: {
          code: { type: "string" },
        },
      },
    },
  },
  async (request, reply) => {
    const userId = verifySignedToken(request.headers.authorization);
    const { code } = request.body;
    const { id: classroomId } = await prisma.classroom.create({
      data: {
        name: code,
      },
      select: {
        id: true,
      },
    });
    await prisma.userInClassroom.create({
      data: { userId, classroomId, role: "Teacher" },
    });
    if (classroomId) {
      reply.status(201);
      reply.send({ success: true, id: classroomId });
    } else {
      reply.status(500);
      reply.send({
        success: false,
        error: "Unable to create a classroom",
      });
    }
  }
);

// Getting classrooms of a user by his username

fastify.get(
  "/api/v1/classrooms",
  {
    schema: {
      headers: {
        properties: {
          authorization: { type: "string" },
        },
        required: ["authorization"],
      },
    },
  },
  async (request, reply) => {
    const id = verifySignedToken(request.headers.authorization);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        classrooms: true,
        username: true,
      },
    });
    reply.status(200);
    reply.send({
      success: true,
      id: user.id,
      classrooms: user.classrooms.map(({ role, classroomId }) => ({
        role,
        id: classroomId,
      })),
      username: user.username,
    });
  }
);

fastify.setErrorHandler(function (error, request, reply) {
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    reply
      .status(401)
      .send({ success: false, error: "Bad authorization token" });
    return;
  }
  if (error.validation) {
    reply.status(400).send({ success: false, error: "Invalid request" });
    return;
  }
  fastify.log.error(error);
  reply.status(500).send({ success: false, error: "an error occured" });
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
