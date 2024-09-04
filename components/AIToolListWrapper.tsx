import { useState, useEffect } from 'react'
import AIToolList from './AIToolList'
import { AITool } from '@/types/AITool'

export default function AIToolListWrapper() {
  const [tools, setTools] = useState<AITool[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/tools')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setTools(Array.isArray(data) ? data : [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching tools:', error)
        setError('Error fetching tools. Please try again later.')
        setIsLoading(false)
      })
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
  };

  const filteredTools = tools.length > 0 ? tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }) : [];

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div>
      <input
        type="text"
        placeholder="搜索工具..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {/* 在这里添加分类选择UI */}
      {tools.length > 0 ? (
        <AIToolList tools={filteredTools} />
      ) : (
        <div>没有找到工具</div>
      )}
    </div>
  )
}