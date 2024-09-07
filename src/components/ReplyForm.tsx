import React, { useState } from 'react';

interface ReplyFormProps {
  commentId: string;
  onReply: (commentId: string, content: string) => void;
}

export default function ReplyForm({ commentId, onReply }: ReplyFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onReply(commentId, content);
      setContent('');
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
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        回复
      </button>
    </form>
  );
}