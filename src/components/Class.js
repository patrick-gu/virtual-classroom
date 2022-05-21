import { useParams } from "react-router-dom";

export default function Class({ id }) {
    const { classId } = useParams();
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
                <input type="text" placeholder="Send a message" />
                <p>Chat message</p>
                <p>Chat message</p>
                <p>Chat message</p>
                <p>Chat message</p>
                <p>Chat message</p>
            </div>
        </div>
    );
}
