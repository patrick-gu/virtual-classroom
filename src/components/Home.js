import { useUnauthenticated } from "../utils/auth";

export default function Home() {
    const setToken = useUnauthenticated();
    return <div>Home</div>;
}
