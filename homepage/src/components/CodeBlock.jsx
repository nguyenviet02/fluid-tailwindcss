import { useState } from 'react'

export default function CodeBlock({ 
  code, 
  language = 'javascript', 
  title,
  showLineNumbers = false,
  className = ''
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className={`relative group ${className}`}>
      {title && (
        <div className="flex items-center justify-between bg-slate-800/80 border-b border-slate-700/50 fl-px-3/5 fl-py-1.5/2.5 rounded-t-lg">
          <span className="fl-text-xs/sm font-medium text-slate-400">{title}</span>
          <span className="fl-text-[10px]/xs text-slate-500 uppercase tracking-wider">{language}</span>
        </div>
      )}
      <div className={`relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 fl-p-3/5 overflow-x-auto ${title ? 'rounded-b-lg border-t-0' : 'fl-rounded-md/lg'}`}>
        <button
          onClick={handleCopy}
          className="absolute fl-top-2/3 fl-right-2/3 fl-p-1.5/2 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Copy code"
        >
          {copied ? (
            <svg className="fl-w-3.5/4 fl-h-3.5/4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="fl-w-3.5/4 fl-h-3.5/4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
        <pre className="fl-text-xs/sm leading-relaxed">
          <code className="text-slate-300">
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="select-none text-slate-600 fl-w-6/8 fl-mr-3/4 text-right shrink-0">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

// Inline code component
export function InlineCode({ children, className = '' }) {
  return (
    <code className={`fl-text-xs/sm text-cyan-400 bg-cyan-500/10 fl-px-1.5/2 fl-py-0.5/1 rounded font-mono ${className}`}>
      {children}
    </code>
  )
}

