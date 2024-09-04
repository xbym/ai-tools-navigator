import React from 'react'
import { AITool } from '@/types/AITool'

interface AIToolListProps {
  tools: AITool[]
}

const AIToolList: React.FC<AIToolListProps> = ({ tools }) => {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool._id}>{tool.name}</li>
      ))}
    </ul>
  )
}

export default AIToolList