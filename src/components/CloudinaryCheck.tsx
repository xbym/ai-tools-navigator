"use client";

import { useEffect } from 'react';

export default function CloudinaryCheck() {
  useEffect(() => {
    console.log('Cloudinary Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  }, []);

  return null;
}