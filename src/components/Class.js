import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";

export default function Class() {
  const [token, setToken] = useAuthenticated();
  const { classId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (socket) return;
    const url = new URL(
      `/api/v1/classrooms/${classId}/chat`,
      "http://localhost:8080"
      //   window.location.href
    );
    url.protocol = url.protocol.replace("http", "ws");
    console.log(url);
    const newSocket = new WebSocket(url);
    newSocket.onopen = () => {
      newSocket.send(token);
      setSocket(newSocket);
    };
    newSocket.onmessage = (message) => {
      setMessages((messages) => [...messages, message.data]);
    };
  }, [classId, token, socket, setSocket]);
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
    socket.send(message);
  };
  return (
    <div>
      <div>
        <h1>Class name goes here</h1>
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
          <input type="submit" value="Send" disabled={!socket} />
        </form>
        <div>
          {messages.map((message, key) => (
            <p key={key}>{message.toString()}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
