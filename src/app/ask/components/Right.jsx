"use client"
import {Input} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import HighlightMarkdown from "@/app/ask/components/HighlightMarkdown";
import ask from "@/app/ask/ask.module.css";
import {useDispatch, useSelector} from "react-redux";
import {addChatMessage} from "@/store/chatMessageSlice";
import {useRenderChatMsg} from "@/utils/useRenderChatMsg";
import {useStreamData} from "@/utils/useStreamData";
import {RoleUser} from "@/app/ask/components/RoleUser";

const {TextArea} = Input;

export default function Right() {
    const [textArea, setTextArea] = useState("")
    const chatMessage = useSelector(state => state.chatMessage)
    const dispatch = useDispatch()
    const {renderMsg} = useRenderChatMsg()
    const {handleStreamData} = useStreamData()
    useEffect(() => {
        handleChatBoxScroll()
    }, [chatMessage])
    const chatBox = useRef(null)

    function handleChangeEvent(e) {
        setTextArea(e.target.value.replace(/\n/g, ''))
    }

    function handleEnterEvent(e) {
        const value = e.target.value.replace(/\n/g, '').trim()
        const length = value.length;
        if (length) {
            const item = {role: "user", content: value}
            dispatch(addChatMessage(item))
            const data = [...chatMessage, item]
            handleStreamData(data)
        }
        setTextArea("")
    }

    function handleChatBoxScroll() {
        chatBox.current.scrollTo({
            behavior: "smooth",
            top: chatBox.current.scrollHeight
        });
    }

    return (
        <div className={`${ask.h100} ${ask.chatContainer} ${ask.rightContainer}`}>
            <div className={ask.chatBox} ref={chatBox}>
                {renderMsg.map((item, index) => {
                    return (
                        <div key={index} style={item.role === 'user'?{display: "flex", justifyContent: "end"}:{}}>
                            {item.role === 'user' ? <RoleUser content={item.content}></RoleUser> : (
                                <HighlightMarkdown content={item.content}></HighlightMarkdown>)}
                        </div>)
                })}
            </div>
            <div className={ask.chatMessage}>
                <TextArea placeholder="请输入你的问题" value={textArea} rows={5}
                          onChange={handleChangeEvent}
                          onPressEnter={handleEnterEvent}></TextArea>
            </div>
        </div>
    )
}
