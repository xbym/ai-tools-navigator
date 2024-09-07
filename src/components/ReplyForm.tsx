import React, { useState } from 'react';

interface ReplyFormProps {
  commentId: string;
  initialContent?: string;
  onReply: (commentId: string, content: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function ReplyForm({ commentId, initialContent = '', onReply, onCancel, isEditing = false }: ReplyFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onReply(commentId, content);
      if (!isEditing) {
        setContent('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded"
        placeholder="写下你的回复..."
      />
      <div className="mt-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          {isEditing ? '保存' : '回复'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}