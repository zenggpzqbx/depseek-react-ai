import {RedoOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useStreamData} from "@/utils/useStreamData";
import {deleteByIndex} from "@/store/chatMessageSlice";
import ask from "../ask.module.css"
export function RoleUser({content}) {
    const [showTools, setShowTools] = useState(false);
    const chatMessage = useSelector((state) => state.chatMessage);
    const {handleStreamData} = useStreamData()
    const dispatch = useDispatch();

    function handleMouseOver() {
        setShowTools(true);
    }

    function handleMouseLeave() {
        setShowTools(false);
    }

    function handleRedoEvent() {
        const index = chatMessage.length - 1;
        if (index >= 0) {
            const ele = chatMessage[index];
            if (ele.role === "user") {
                handleStreamData(chatMessage)
            } else {
                dispatch(deleteByIndex(index))
                const data = chatMessage.slice(0, index - 1);
                handleStreamData(data)
            }
        }
        setShowTools(false);
    }

    return (
            <div className={`${ask.messageDefault} ${ask.roleUser} ${ask.messageClient}`} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave} >
                <div className={`${ask.userTools}`}>
                    {showTools ? <RedoOutlined onClick={handleRedoEvent}/> : ""}
                </div>
                <div>{content}</div>
            </div>
    )
}
