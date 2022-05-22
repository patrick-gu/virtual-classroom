import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import { apiRequest } from "../utils/request";

export default function Class() {
  const [token, setToken] = useAuthenticated();
  const { classId } = useParams();
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  useEffect(() => {
    if (socket.current !== undefined) return;
    socket.current = null;
    const url = new URL(
      `/api/v1/classrooms/${classId}/chat`,
      "http://localhost:8080"
      //   window.location.href
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

  const navigate = useNavigate();
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
  };
  return (
    <div>
      <div>
        <Link to="/classes">Back to all classes</Link>
        <h1>{classInfo.name}</h1>
        {classInfo.open !== undefined && (
          <p>
            {classInfo.open
              ? `The classroom code is: ${classInfo.code}`
              : "This class is currently closed."}
          </p>
        )}
        <p>Class id: {classId}</p>
      </div>

      {quizzes ? (
        <div>
          <h2>Quizzes</h2>
          {quizzes.map(({ id, name }) => (
            <div key={id}>
              <h3>{name}</h3>
              <p>Description</p>
            </div>
          ))}
        </div>
      ) : null}
      <div>
        <h2>Chat</h2>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Send a message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <input type="submit" value="Send" disabled={!socket.current} />
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              <p>{message.text}</p>
              <p>
                <i>{users[message.userId]?.username ?? "Unknown"}</i> -{" "}
                {users[message.userId]?.role ?? "Unknown"}
              </p>
              <small>
                <time dateTime={message.timestamp}>{message.timestamp}</time>
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
