"use client"
import ask from "./ask.module.css"
import {Input} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import {useImmer} from "use-immer";
import KeyManager from "@/utils/KeyManager";
import RealInfoSet from "@/utils/realInfo/RealInfoSet"
import _ from "lodash";
import HighlightMarkdown from "@/components/HighlightMarkdown";

const {TextArea} = Input;

function Ask() {
    const currentRequestTool = [];
    const [textArea, setTextArea] = useState("")
    const [chatMessage, setChatMessage] = useImmer([{
        role: "assistant",
        content: "你好，我是个AI智能问答应用，请告诉我你的需要！"
    }])
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
            setChatMessage((draft) => {
                draft.push({role: "user", content: value})
            })
            const data = [...chatMessage, {role: "user", content: value}]
            handleStreamData(data)
        }
        setTextArea("")
    }

    function generateTextByFetch(data) {
        console.log(chatMessage, 'chatMessage')
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
        console.log(res, 'res====')
        if (res.status !== 200) return
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let message = ""
        setChatMessage((draft) => {
            draft.push({role: "assistant", content: ""})
        })

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
                            setChatMessage((draft) => {
                                const index = draft.length - 1;
                                draft[index].content = message
                            })
                        }
                        if (tool_calls) {
                            console.log(tool_calls, '=====tool-')
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
            console.log(res, "天气调用完成！");
            const {status, data} = res;
            if (status !== 200) {
                return null
            }
            const value = data.lives[0];
            const info = `${value.city}的天气描述，实时气温：${value.temperature}摄氏度, 天气现象是:${value.weather}, 风向：${value.winddirection}, 风力级别：${value.windpower}级`;
            setChatMessage((draft) => {
                draft.push(
                    {role: "assistant", content: "", tool_calls: _.cloneDeep(currentRequestTool)},
                    {role: "tool", content: info, tool_call_id: item.id}
                );
            })
            const temp = [
                ...chatMessage,
                {
                    role: "assistant",
                    content: "",
                    tool_calls: _.cloneDeep(currentRequestTool)
                },
                {role: "tool", content: info, tool_call_id: item.id}]
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
        <div className={ask.chatContainer}>
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

export default Ask
