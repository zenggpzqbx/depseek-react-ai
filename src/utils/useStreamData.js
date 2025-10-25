import {addChatMessage, updateChatMessage} from "@/store/chatMessageSlice";
import RealInfoSet from "@/utils/realInfo/weather";
import _ from "lodash";
import KeyManager from "@/utils/KeyManager";
import {useDispatch, useSelector} from "react-redux";

const currentRequestTool = [];

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

export function useStreamData() {
    const chatMessage = useSelector(state => state.chatMessage)
    const dispatch = useDispatch()

    async function handleStreamData(data) {
        const res = await generateTextByFetch(data)
        // console.log(res, 'res====')
        if (res.status !== 200) return
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let message = ""
        const item = {role: "assistant", content: ""}
        dispatch(addChatMessage(item))

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
                            dispatch(updateChatMessage(message))
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
            dispatch(addChatMessage(payload))
            const temp = [
                ...chatMessage,
                ...payload,]
            currentRequestTool.length = 0;
            await handleStreamData(temp);
        }
    }

    return {handleStreamData}
}
