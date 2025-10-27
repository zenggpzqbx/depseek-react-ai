"use client"
import Image from "next/image";
import {useRouter} from "next/navigation";
import setting from "./setting.module.css"
import Theme from "@/app/ask/setting/components/Theme";
export default function Setting() {
    const router = useRouter();

    function handleBackEvent() {
        router.back()
    }

    return (
        <div className={`${setting.container}`}>
            <div className={`flex justify-between ${setting.header}`}>
                <div>应用设置</div>
                <Image src={"/svg/回退.svg"} alt={"回退"} width={30} height={30} onClick={handleBackEvent}></Image>
            </div>
            <div>
                <Theme></Theme>
            </div>
        </div>
    )
}
