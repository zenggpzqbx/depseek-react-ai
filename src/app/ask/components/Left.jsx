import Image from "next/image";
import ask from "../ask.module.css"
import {Modal} from "antd";
import {useState} from "react";
import {useRenderChatMsg} from "@/utils/useRenderChatMsg";

export default function Left() {
    const {renderMsg} = useRenderChatMsg()
    const [isOpen, setIsOpen] = useState(false);
    const showModal = () => {
        setIsOpen(true);
    };

    const handleOk = () => {
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };
    const imgList = [
        {
            src: "/svg/文档预览.svg", alt: "预览", label: "消息预览", width: 30, height: 30, onClick: () => {
                setIsOpen(true);
            }
        },
    ]
    return (
        <div className={`${ask.leftContainer} ${ask.h100}`}>
            <Modal open={isOpen} title={"消息记录"} closable={{'aria-label': 'Custom Close Button'}} width={1200}
                   footer={null}
                   onOk={handleOk}
                   onCancel={handleCancel}>
                <div className={ask.historyContainer}>
                    {renderMsg.map((item, index) => {
                        return (
                            <div key={index} className={`flex flex-1`}>
                                <div className={`${ask.historyRole}`}>{item.role}</div>
                                <div className={`${ask.historyMessage}`}>{item.content}</div>
                            </div>
                        )
                    })}
                </div>
            </Modal>
            {imgList.map((img, index) => {
                return (
                    <div key={index} className={`flex flex-col justify-center items-center`} onClick={img.onClick}>
                        <Image {...img} style={{textAlign: "center"}}></Image>
                        <div>{img.label}</div>
                    </div>
                )
            })}
        </div>
    )
}
