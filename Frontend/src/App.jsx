import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [ count, setCount ] = useState(0)
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    prism.highlightAll()
  }, [])

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [theme])

  async function reviewCode() {
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Code Reviewer</h1>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>
      <main>
      
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid var(--border-color)",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <Markdown
            rehypePlugins={[ rehypeHighlight ]}
          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}



export default App