import { ChatOpenAI } from '@langchain/openai';

import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createClient } from '@supabase/supabase-js';

// document.addEventListener('submit', (e) => {
//     e.preventDefault()
//     progressConversation()
// })

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
const sbApiKey = import.meta.env.VITE_SUPABASE_API
const sbUrl = import.meta.env.VITE_SUPABASE_URL
const embeddings = new OpenAIEmbeddings({openAIApiKey})
const llm = new ChatOpenAI({openAIApiKey})

const client = createClient(sbUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents',
})

export const retriever = vectorStore.asRetriever()