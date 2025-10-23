import Markdown from 'react-markdown'
import {useEffect, useMemo, useRef} from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';


function CodeBlock({node, inline, className, children, ...props}) {
    console.log(node, inline, className, children, props, '-----------')
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    const codeContent = String(children).replace(/\n$/, '')
    const codeBlockRef = useRef(null)
    useEffect(() => {
        if (codeBlockRef.current && !inline && language) {
            try {
                hljs.highlightElement(codeBlockRef.current)
            } catch (error) {
                console.warn('Highlight.js error:', error)
            }
        }
    }, [inline, language, codeContent])
    if (inline) {
        return (
            <code
                className="inline-code"
                {...props}
                style={{
                    background: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    color: '#e83e8c'
                }}
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
        <Markdown components={{code: CodeBlock}}>
            {content}
        </Markdown>
    )
}
