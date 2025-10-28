import {CheckOutlined, CopyOutlined, RedoOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {useStreamData} from "@/utils/useStreamData";
import {deleteByIndex} from "@/store/chatMessageSlice";
import ask from "../ask.module.css"
import {useEffect, useRef, useState} from "react";
import {useImmer} from "use-immer";

export function RoleUser({content}) {
    const chatMessage = useSelector((state) => state.chatMessage);
    const {handleStreamData} = useStreamData()
    const dispatch = useDispatch();
    const [isCopy, setIsCopy] = useState(false);
    const [tools, setTools] = useImmer({
        show: false,
        top: 0
    });
    const useInputRef = useRef(null)
    useEffect(() => {
        setTools(draft => {
            draft.top = useInputRef.current.clientHeight
        });
    }, [])

    function handleRedoEvent() {
        const index = chatMessage.length - 1;
        if (index >= 0) {
            const ele = chatMessage[index];
            if (ele.role === "user") {
                handleStreamData(chatMessage)
            } else {
                dispatch(deleteByIndex(index))
                const data = chatMessage.slice(0, index);
                handleStreamData(data)
            }
        }
    }

    function handleCopeEvent() {
        navigator.clipboard.writeText(content).then(result => {
            setIsCopy(true);
        })
        setTimeout(() => {
            setIsCopy(false);
        }, 500)
    }

    function handleShowTools() {
        setTools(draft => {
            draft.show = true
        })
    }

    function handleCloseTools() {
        setTools(draft => {
            draft.show = false
        })
    }

    return (
        <div className={`${ask.messageDefault}`} onMouseEnter={handleShowTools} onMouseLeave={handleCloseTools}>
            <div className={`${ask.messageClient} ${ask.msgTextColor}`} ref={useInputRef}>{content}</div>
            {tools.show ? (<div className={`${ask.userTools}`} style={{top: `${tools.top}px`, right: `0`}}>
                <RedoOutlined onClick={handleRedoEvent}/>
                {!isCopy ?
                    (<CopyOutlined onClick={handleCopeEvent}/>)
                    : (<CheckOutlined onClick={handleCopeEvent}/>)}
            </div>) : null}

        </div>
    )
}
