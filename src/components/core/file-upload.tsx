import { useState } from "react";
import { SimpleGrid, Image, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

interface FileUploadWithPreviewProps {
  onFileUpload: (fileUrl: string) => void; // Parent component callback to receive the file URL
}

export function FileUploadWithPreview({
  onFileUpload,
}: FileUploadWithPreviewProps) {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  const handleDrop = async (newFiles: FileWithPath[]) => {
    setUploading(true);
    setFiles(newFiles);

    try {
      const file = newFiles[0]; // Assuming you upload the first file in the list

      const formData = new FormData();
      formData.append("file", file);

      // Replace with your Vercel endpoint or any server API for file uploads
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      const fileUrl = data.url; // Assuming the server returns { url: string }

      // Pass the URL to the parent component
      onFileUpload(fileUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={handleDrop}
        loading={uploading}
      >
        <Text className="text-center">Drag images here</Text>
      </Dropzone>

      <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </div>
  );
}
