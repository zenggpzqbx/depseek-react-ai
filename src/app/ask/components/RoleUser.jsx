import {RedoOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import {useStreamData} from "@/utils/useStreamData";
import {deleteByIndex} from "@/store/chatMessageSlice";
import ask from "../ask.module.css"
import {useState} from "react";

export function RoleUser({content}) {
    const chatMessage = useSelector((state) => state.chatMessage);
    const {handleStreamData} = useStreamData()
    const dispatch = useDispatch();
    const [isCopy, setIsCopy] = useState(false);

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

    return (
        <div className={`${ask.messageDefault}`}>
            <div className={`${ask.messageClient}`}>{content}</div>
            <div className={`${ask.userTools}`}>
                <RedoOutlined onClick={handleRedoEvent}/>
                {!isCopy ?
                    (<Image src={"/svg/复制.svg"} alt={"复制"} width={20} height={20}
                            onClick={handleCopeEvent}></Image>)
                    : (<Image src={"/svg/对号.svg"} alt={"复制"} width={20} height={20}
                              onClick={handleCopeEvent}></Image>)}
            </div>
        </div>
    )
}
