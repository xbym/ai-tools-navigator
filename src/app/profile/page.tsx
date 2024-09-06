'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiFetch('/api/users/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ... rest of the component
}