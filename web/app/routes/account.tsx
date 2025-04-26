import type { Route } from "./+types/account";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Test route" },
        { name: "description", content: "Test route description" },
    ];
}

export default function Home() {
    return <Welcome />;
}