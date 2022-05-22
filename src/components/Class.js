import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";

export default function Class() {
  const [token, setToken] = useAuthenticated();
  const { classId } = useParams();
  const socket = useRef();
  const [messages, setMessages] = useState([]);
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
      setMessages((messages) => [
        ...messages,
        JSON.parse(message.data.toString()),
      ]);
    };

    return () => {
      socket.current?.close();
    };
  });

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
          <input type="submit" value="Send" disabled={!socket.current} />
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              <p>{message.text}</p>
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
