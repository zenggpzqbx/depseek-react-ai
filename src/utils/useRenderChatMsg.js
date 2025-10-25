import {useSelector} from "react-redux";
import {useMemo} from "react";

export function useRenderChatMsg() {
    const chatMessage = useSelector(state => state.chatMessage)
    const renderMsg = useMemo(() => {
        return chatMessage.filter(item => !!item.content && ["user", "assistant"].includes(item.role));
    }, [chatMessage]);
    return {renderMsg}
}
