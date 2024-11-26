import { Group, SimpleGrid, Text, rem, ActionIcon } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";

interface UploadImagesProps {
  files: string[]; // Changed to store URLs instead of FileWithPath
  setFiles: Dispatch<SetStateAction<string[]>>;
}

export const UploadImages: React.FC<UploadImagesProps> = ({
  files,
  setFiles,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<FileWithPath[]>([]);

  const uploadToVercel = async (file: FileWithPath) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleDrop = async (acceptedFiles: FileWithPath[]) => {
    setUploadingFiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map(uploadToVercel);
    const uploadedUrls = await Promise.all(uploadPromises);

    const validUrls = uploadedUrls.filter((url): url is string => url !== null);
    setFiles((prevFiles) => [...prevFiles, ...validUrls]);
    setUploadingFiles([]);
  };

  const removeImage = (urlToRemove: string) => {
    setFiles((prevFiles) => prevFiles.filter((url) => url !== urlToRemove));
  };

  const previews = files.map((url, index) => (
    <div key={index} className="relative">
      <Image src={url} alt={url} width={200} height={200} />
      <ActionIcon
        color="red"
        variant="filled"
        className="absolute top-2 right-2"
        onClick={() => removeImage(url)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </div>
  ));

  return (
    <div>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={handleDrop}
        loading={uploadingFiles.length > 0}
        maxSize={2 * 1024 ** 2} // 5MB max file size
        multiple={true}
        disabled={false}
        maxFiles={5}
        styles={(theme) => ({
          root: {
            borderRadius: rem(12),
            border: `1px dashed var(--mantine-color-gray-4)`, // Slightly more visible border
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)", // Subtle elevation
            "&:hover": {
              borderColor: theme.colors.blue[6],
              backgroundColor: theme.colors.blue[0],
            },
            "&[data-accept]": {
              borderColor: "var(--mantine-color-green-6)",
              backgroundColor: "var(--mantine-color-green-0)",
            },
            "&[data-reject]": {
              borderColor: "var(--mantine-color-red-6)",
              backgroundColor: "var(--mantine-color-red-0)",
            },
          },
        })}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach at most eight files as you like, each file should not
              exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </div>
  );
};
