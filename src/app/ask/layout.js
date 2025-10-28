import Left from "@/app/ask/components/Left";
import ask from "./ask.module.css"
export default function AskLayout({children}) {

    return (
        <div className={`flex justify-center ${ask.w100} ${ask.h100}`}>
            <Left></Left>
            {children}
        </div>
    )
}
