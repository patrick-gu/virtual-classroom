import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import { apiRequest } from "../utils/request";
import "./Class.css";

export default function Class() {
  const [token, setToken] = useAuthenticated();
  const { classId } = useParams();
  const [classroom, setClassroom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const p = await apiRequest({
        method: "GET",
        path: `/classrooms/${classId}`,
        token,
        setToken,
        navigate,
      });
      // setClassroom(p);
      console.log(p);
    })();
  }, [navigate, setToken, token]);

  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (socket.current !== undefined) return;
    socket.current = null;
    const url = new URL(
      `/api/v1/classrooms/${classId}/chat`,
      process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080"
    );
    url.protocol = url.protocol.replace("http", "ws");
    const newSocket = new WebSocket(url);
    newSocket.onopen = () => {
      newSocket.send(token);
      socket.current = newSocket;
    };
    newSocket.onmessage = (message) => {
      message = JSON.parse(message.data.toString());
      switch (message.kind) {
        case "message":
          setMessages((messages) => [message.message, ...messages]);
          break;
        case "messages":
          setMessages((messages) => [...message.messages, ...messages]);
          break;
        case "users":
          setUsers((users) => {
            users = { ...users };
            for (const { username, id, role } of message.users) {
              users[id] = { username, role };
            }
            return users;
          });
          break;
        case "userId":
          setUserId(message.userId);
          break;
        default:
      }
    };

    return () => {
      socket.current?.close();
    };
  });

  const [classInfo, setClassInfo] = useState({
    name: "Loading...",
  });

  // const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const newClassInfo = await apiRequest({
        method: "GET",
        path: `/classrooms/${classId}`,
        token,
        setToken,
        navigate,
      });
      setClassInfo(newClassInfo);
    })();
  }, [classId, setClassInfo, token, setToken, navigate]);

  const quizzes = [
    {
      id: "123",
      name: "Example Quiz 1",
    },
    {
      id: "1234",
      name: "Example Quiz 2",
    },
  ];
  const [message, setMessage] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    socket.current.send(message);
    e.target.reset();
  };

  const [name, setName] = useState("");
  const changeName = async (e) => {
    e.preventDefault();
    await apiRequest({
      method: "POST",
      path: `/classrooms/${classId}`,
      token,
      setToken,
      body: {
        name,
      },
      navigate,
    });
    setClassInfo((classInfo) => ({ ...classInfo, name }));
  };

  return (
    <>
      <div className="container">
        <div>
          <h1>{classInfo.name}</h1>
          <p>Class id: {classId}</p>
          {classInfo.code !== undefined && (
            <p>
              {classInfo.code
                ? `The code to join this classroom is ${classInfo.code}`
                : "This classroom is not currently open."}
            </p>
          )}
          <p></p>
        </div>
      </div>
      <div className="chat">
        <h2>Chat</h2>

        <div className="chat__body ">
          {messages.map((message) => (
            <div
              className={`message_text ${
                userId === message.userId ? "" : "chat__reciever"
              }`}
              key={message.id}
            >
              <p>{message.text}</p>
              <p>
                <strong>
                  {users[message.userId]?.username ?? "Unknown"} -{" "}
                  {users[message.userId]?.role ?? "Unknown"}
                </strong>
              </p>
              <small className="chat__timestamp">
                <time dateTime={message.timestamp}>
                  {new Date(message.timestamp).toLocaleString()}
                </time>
              </small>
            </div>
          ))}
        </div>
      </div>
      <form className="message_footer" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Send a message"
          className="form-control"
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          className="hidden"
          type="submit"
          value="Send"
          disabled={!socket.current}
        />
      </form>
    </>
  );
}
