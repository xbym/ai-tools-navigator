import React, { useRef } from 'react';
import { useToast } from '@/hooks/useToast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label: string;
}

export default function ImageUpload({ onUpload, label }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // 防止可能的表单提交
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      onUpload(data.url);
      showToast('图片上传成功', 'success');
    } catch (error) {
      console.error('上传错误:', error);
      showToast('图片上传失败', 'error');
    }
  };

  return (
    <div>
      <button
        type="button" // 确保这是一个按钮类型，而不是提交类型
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {label}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}