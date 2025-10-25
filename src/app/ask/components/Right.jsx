"use client"
import {Input} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import {useImmer} from "use-immer";
import KeyManager from "@/utils/KeyManager";
import RealInfoSet from "@/utils/realInfo/RealInfoSet"
import _ from "lodash";
import HighlightMarkdown from "@/components/HighlightMarkdown";
import ask from "@/app/ask/ask.module.css";
import {useDispatch, useSelector} from "react-redux";
import {addChatMessage, updateChatMessage} from "@/store/chatMessageSlice";

const {TextArea} = Input;

export default function Right() {
    const currentRequestTool = [];
    const [textArea, setTextArea] = useState("")
    const chatMessage = useSelector(state => state.chatMessage)
    const diapatch = useDispatch()
    const renderChatMessage = useMemo(() => {
        return chatMessage.filter(item => !!item.content && ["user", "assistant"].includes(item.role));
    }, [chatMessage])
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
            diapatch(addChatMessage(item))
            const data = [...chatMessage, item]
            handleStreamData(data)
        }
        setTextArea("")
    }

    function generateTextByFetch(data) {
        // console.log(chatMessage, 'chatMessage')
        return fetch("https://api.deepseek.com/chat/completions", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${KeyManager.DeepseekKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: data,
                stream: true,
                tools: [RealInfoSet.getWeatherTool()]
            })
        });
    }

    async function handleStreamData(data) {
        const res = await generateTextByFetch(data)
        // console.log(res, 'res====')
        if (res.status !== 200) return
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let message = ""
        const item = {role: "assistant", content: ""}
        diapatch(addChatMessage(item))

        // 返回流的处理
        while (true) {
            try {
                const {done, value} = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, {stream: true});
                // console.log(chunk, "chunk");
                const lines = chunk.split("\n").filter(item => !!item.trim());
                for (const line of lines) {
                    const value = line.slice(6);
                    if (value === "[DONE]") break;
                    const data = JSON.parse(value)
                    data?.choices?.forEach((choice) => {
                        // console.log(choice, 'choice');
                        const {tool_calls, content} = choice.delta
                        if (content) {
                            message = message + content;
                            diapatch(updateChatMessage(message))
                        }
                        if (tool_calls) {
                            // console.log(tool_calls, '=====tool-')
                            tool_calls.forEach((c) => {
                                const hasCall = currentRequestTool.find(item => item.index === c.index);
                                if (hasCall) {
                                    hasCall.function.arguments += c.function.arguments;
                                } else {
                                    currentRequestTool.push({
                                        index: c.index,
                                        id: c.id,
                                        type: c.type,
                                        function: {
                                            name: c.function.name,
                                            arguments: c.function.arguments
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } catch (err) {
                await reader.cancel();
            }
        }
        await reader.cancel();
        if (!currentRequestTool.length) return
        for await (const item of currentRequestTool) {
            const props = JSON.parse(item.function.arguments);
            const res = await RealInfoSet[item.function.name](props.city || "110000")
            // console.log(res, "天气调用完成！");
            const {status, data} = res;
            if (status !== 200) {
                return null
            }
            const value = data.lives[0];
            const info = `${value.city}的天气描述，实时气温：${value.temperature}摄氏度, 天气现象是:${value.weather}, 风向：${value.winddirection}, 风力级别：${value.windpower}级`;
            const payload = [
                {role: "assistant", content: "", tool_calls: _.cloneDeep(currentRequestTool)},
                {role: "tool", content: info, tool_call_id: item.id}
            ]
            diapatch(addChatMessage(payload))
            const temp = [
                ...chatMessage,
                ...payload,]
            currentRequestTool.length = 0;
            await handleStreamData(temp);
        }
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
                {renderChatMessage.map((item, index) => {
                    return (
                        <div key={index}
                             className={`${ask.messageDefault} ${item.role === 'user' ? ask.messageClient : ask.messageServer}`}>
                            {item.role === 'user' ? item.content : (
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
