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
        default:
      }
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
    <>
      <div className="container">
        <div>
          <h2>{classroom}</h2>
          <p>Class id: {classId}</p>
        </div>
      </div>
      <div className="chat">
        <h2>Chat</h2>
        
        <div className="chat__body">
          {messages.map((message) => (
            <div className="message_text" key={message.id}>
              <p>{message.text}</p>
              <small className="chat__timestamp">
                <time dateTime={message.timestamp}>{message.timestamp}</time>
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
          <input className="hidden" type="submit" value="Send" disabled={!socket.current} />
        </form>
    </>
  );
}
