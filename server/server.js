const Fastify = require("fastify");
const fastifyWebsocket = require("@fastify/websocket");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const EventEmitter = require("events");

dotenv.config();
// dotenv is required to read data from .env file

const prisma = new PrismaClient();

// fetch a user by his/her username

const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, classrooms: true, username: true },
  });
  return user;
};

// fetch a classroom by its name
const getClassByName = async (code) => {
  const classroom = await prisma.classroom.findUnique({
    where: { name: code },
    select: { name: true, users: true, messages: true, quizzes: true },
  });
  return classroom;
};

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

fastify.get("/", async (req, reply) => {
  reply.send({ hello: "world" });
  console.log("reached");
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
  async (req, reply) => {
    let { username, password, role } = req.body;
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
  async (req, reply) => {
    const { username, password } = req.body;
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
  async (req, reply) => {
    const userId = verifySignedToken(req.headers.authorization);
    const { code } = req.body;
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
    },
  },
  async (req, reply) => {
    const userId = verifySignedToken(req.headers.authorization);
    const { id: classroomId, name } = await prisma.classroom.create({
      data: {
        name: "Unnamed Classroom",
      },
      select: {
        id: true,
        name: true,
      },
    });
    await prisma.userInClassroom.create({
      data: { userId, classroomId, role: "Teacher" },
    });
    if (classroomId) {
      reply.status(201);
      reply.send({ success: true, id: classroomId, name });
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
  async (req, reply) => {
    const id = verifySignedToken(req.headers.authorization);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        classrooms: {
          select: {
            classroomId: true,
            role: true,
            classroom: {
              select: {
                name: true,
              },
            },
          },
        },
        username: true,
      },
    });
    reply.status(200);
    reply.send({
      success: true,
      id: user.id,
      classrooms: user.classrooms.map(({ role, classroomId, classroom }) => ({
        role,
        id: classroomId,
        name: classroom.name,
      })),
      username: user.username,
    });
  }
);

//  Getting quizzes from a classroom

fastify.get(
  "/api/v1/classrooms/quizzes",
  {
    schema: {
      query: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
    },
  },
  async (req, reply) => {
    const { name } = req.query;
    const { quizzes } = await getClassByName(name);
    if (quizzes) {
      reply.status(200);
      reply.send({ success: true, quizzes });
    } else {
      reply.status(401);
      reply.send({ success: false, error: "Invalid classroom!" });
    }
  }
);

// Creating quiz
// Datbase logic to be updated(I think mine is wrong because tables are connected to each other and I did not do so)
fastify.post(
  "/api/v1/classrooms/quizzes/create",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          classroomName: { type: "string" },
          questions: { type: "array" },
        },
      },
    },
  },
  async (req, reply) => {
    const { username, classroomName, questions } = req.body;
    const user = await getUserByUsername(username);
    if (user.role === "Teacher") {
      const classroom = await getClassByName(classroomName);
      const quiz = await prisma.quiz.create({
        data: {
          classroom,
          classroomId: classroom.id,
          questions,
        },
        select: {
          id: true,
        },
      });
      if (quiz) {
        reply.status(200);
        reply.send({ success: true, quiz });
      } else {
        reply.status(401);
        reply.send({ success: false, error: "Invalid classroom!" });
      }
    } else {
      reply.status(401);
      reply.send({ success: false, error: "Not a teacher!" });
    }
  }
);

fastify.setErrorHandler(function (error, req, reply) {
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
    reply.status(400).send({ success: false, error: "Invalid req" });
    return;
  }
  fastify.log.error(error);
  console.error(error);
  reply.status(500).send({ success: false, error: "an error occured" });
});

function isUuid(s) {
  return /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/.test(
    s
  );
}

const chat = new EventEmitter();

fastify.register(fastifyWebsocket);
fastify.register(async function (fastify) {
  fastify.get(
    "/api/v1/classrooms/:id/chat",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
      websocket: true,
    },
    async (connection, req) => {
      const { id: classroomId } = req.params;

      const token = await new Promise((resolve, reject) => {
        connection.socket.once("message", (message) => {
          resolve(message.toString());
        });
      });

      const userId = verifySignedToken(token);
      if (!isUuid(classroomId)) {
        return;
      }
      const isInClassroom = await prisma.userInClassroom.count({
        where: {
          userId,
          classroomId,
        },
      });
      if (!isInClassroom) {
        return;
      }

      connection.socket.on("message", async (text) => {
        text = text.toString();
        const { id, timestamp } = await prisma.message.create({
          data: {
            userId,
            classroomId,
            text,
          },
          select: {
            id: true,
            timestamp: true,
          },
        });
        const message = {
          kind: "message",
          message: { id, timestamp, text, userId },
        };
        chat.emit(classroomId, JSON.stringify(message));
      });
      const onChatMessage = (message) => {
        connection.socket.send(message);
      };
      chat.on(classroomId, onChatMessage);
      connection.socket.on("close", () => {
        chat.off(classroomId, onChatMessage);
      });

      const messages = await prisma.message.findMany({
        select: {
          id: true,
          text: true,
          userId: true,
          timestamp: true,
        },
        where: {
          classroomId,
        },
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
        take: 20,
      });
      connection.socket.send(
        JSON.stringify({
          kind: "messages",
          messages,
        })
      );
    }
  );
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
