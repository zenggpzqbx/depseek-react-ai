"use client"
import ask from "./ask.module.css"
import Left from "@/app/ask/components/Left";
import Right from "@/app/ask/components/Right";

function Ask() {
    return (
        <div className={`${ask.w100} ${ask.h100} flex flex-1`}>
            <Left></Left>
            <Right></Right>
        </div>
    )
}

export default Ask
