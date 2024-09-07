import React from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  url: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ url }) => {
  return (
    <div className="mt-2">
      <Image
        src={url}
        alt="Uploaded image preview"
        width={200}
        height={200}
        className="object-cover rounded"
      />
    </div>
  );
};

export default ImagePreview;