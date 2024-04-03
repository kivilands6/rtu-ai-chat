import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import sendLogo from './assets/send.svg'
import './App.css'
import Header from './components/Header'

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { OpenAIEmbeddings } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';

import { retriever } from './retriever.js';
import { combineDocuments } from './combineDocuments.js';

function App() {
  const [count, setCount] = useState(0)

  const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
  console.log(hello)
  const sbApiKey = import.meta.env.VITE_SUPABASE_API
  const sbUrl = import.meta.env.VITE_SUPABASE_URL
  const embeddings = new OpenAIEmbeddings({openAIApiKey})
  const llm = new ChatOpenAI({openAIApiKey})

  const standaloneQeustionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQeustionTemplate)

  const asnwerTemplate = `You are a helpful support bot who can answer questions about universities based on context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email kivilands6@gmail.com. Don't try to make up an answer. Always spek as if you were chatting to a friend.
  context: {context}
  question: {question}
  answer: `

  const answerPrompt = PromptTemplate.fromTemplate(asnwerTemplate)

  const standaloneQuestionChain = RunnableSequence.from([standaloneQuestionPrompt, llm, new StringOutputParser()])
  const retrieverChain = RunnableSequence.from([
      prevResult => prevResult.standalone_question,
      retriever,
      combineDocuments
  ])
  const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())

  const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
    },
    {
        context: retrieverChain,
        question: ({original_input}) => original_input.question
    },
    {
        answerChain
    }
  ])

  async function handleSubmit(e){
    e.preventDefault()
    
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

    const response = await chain.invoke({question: question})
    const answerText = response.answerChain;
    console.log(response)

    // add AI message
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    chatbotConversation.appendChild(newAiSpeechBubble)
    newAiSpeechBubble.textContent = answerText
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
  }

  return (
    <>
      <Header />
      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <main>
          <section class="chatbot-container">
              <div class="chatbot-header">
                  <img src="images/logo-scrimba.svg" class="logo"/>
                  <p class="sub-heading">Knowledge Bank</p>
              </div>
              <div class="chatbot-conversation-container" id="chatbot-conversation-container">
              </div>
              <form id="form" class="chatbot-input-container" onSubmit={handleSubmit}>
                  <input name="user-input" type="text" id="user-input" required/>
                  <button id="submit-btn" class="submit-btn">
                          <img
                              src={sendLogo}   
                              class="send-btn-icon"
                          />
                  </button>
              </form>
          </section>
      </main>
    </>
  )
}

export default App
