import React, { useState } from 'react';

interface EditCommentFormProps {
  initialContent: string;
  initialRating: number;
  onSave: (content: string, rating: number) => void;
  onCancel: () => void;
}

export default function EditCommentForm({ initialContent, initialRating, onSave, onCancel }: EditCommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content, rating);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 bg-gray-800 text-white rounded"
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mt-2 p-2 bg-gray-800 text-white rounded"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <option key={value} value={value}>{value} 星</option>
        ))}
      </select>
      <div className="mt-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">保存</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">取消</button>
      </div>
    </form>
  );
}