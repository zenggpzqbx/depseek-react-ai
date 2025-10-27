import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ask from "@/app/ask/ask.module.css";


function CodeBlock({node, inline, className, children, ...props}) {
    // console.log(node, inline, className, children, props, '-----------')
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    // console.log(children, 'children')
    if (inline) {
        return (
            <code
                className={`${ask.fontColor}`}
                {...props}
            >
                {children}
            </code>
        )
    }
    return (
        <SyntaxHighlighter language={language} style={docco}>
            {children}
        </SyntaxHighlighter>

    )
}

export default function HighlightMarkdown({content}) {
    return (
        <div className={`${ask.messageDefault} ${ask.messageServer} ${ask.msgTextColor}`}>
            <Markdown components={{code: CodeBlock}}>
                {content}
            </Markdown>
        </div>

    )
}
