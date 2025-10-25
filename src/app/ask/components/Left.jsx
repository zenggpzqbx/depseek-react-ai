import Image from "next/image";
import ask from "../ask.module.css"

export default function Left() {
    const imgList = [
        {src:"/svg/文档预览.svg", alt:"预览", label:"消息预览", width: 30, height: 30, onClick:() => {}},
    ]
    return (
        <div className={`${ask.leftContainer} ${ask.h100}`}>
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
