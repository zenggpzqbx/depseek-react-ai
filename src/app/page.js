import Link from "next/link";
import page from "./page.module.css"
import {v4 as uuid4} from "uuid";
export default function Home() {
    const routes = [
        {id: uuid4(), href: "/ask", label: "问答界面"}
    ]
    return (
        <div className={page.container}>
            {routes.map(route => (<Link href={route.href} key={route.id} className={page.item}>{route.label}</Link>))}
        </div>
    );
}
