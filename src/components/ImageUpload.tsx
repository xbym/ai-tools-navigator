import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
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