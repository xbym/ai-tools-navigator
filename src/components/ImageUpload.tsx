import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [cloudName, setCloudName] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCloudName(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('Cloudinary Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  }, []);

  if (!cloudName) {
    return <div>Loading Cloudinary configuration...</div>;
  }

  return (
    <CldUploadWidget
      uploadPreset="ai_tools_navigator"
      onUpload={(result: any) => {
        if (result.event !== "success") return;
        onUpload(result.info.secure_url);
      }}
    >
      {({ open }) => {
        return (
          <button
            onClick={() => open()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            上传图片
          </button>
        );
      }}
    </CldUploadWidget>
  );
}