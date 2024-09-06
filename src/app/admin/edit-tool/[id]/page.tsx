"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';

export default function EditTool({ params }: { params: { id: string } }) {
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    tags: '',
    iconUrl: '',
    screenshotUrl: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await apiFetch(`/api/tools/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tool');
        }
        const data = await response.json();
        setToolData(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching tool data');
      }
    };

    fetchTool();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiFetch(`/api/tools/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toolData),
      });

      if (!response.ok) {
        throw new Error('Failed to update tool');
      }

      router.push('/admin');
    } catch (err) {
      setError('Error updating tool. Please try again.');
      console.error(err);
    }
  };

  // ... rest of the component (including ImageUpload handlers)

  return (
    <Layout title="Edit AI Tool - AI Tools Navigator">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
        {/* Form fields */}
      </form>
    </Layout>
  );
}