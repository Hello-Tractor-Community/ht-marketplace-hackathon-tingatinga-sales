"use client";
import React, { useState } from "react";
import { Avatar, Button, Flex, Group, FileInput, Badge } from "@mantine/core";
import { toast } from "sonner";
import { useGetUserQuery } from "@/lib/swr/hooks";

const UserProfile = () => {
  const { user } = useGetUserQuery();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.image ?? "");
  const [isUploading, setIsUploading] = useState(false);

  // Upload file to the server
  const uploadToVercel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const { url } = await response.json();
      toast.success("Profile photo uploaded successfully");
      return url;
    } catch (error) {
      toast.error("Could not upload the profile photo");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Update user profile with new image URL
  const updateUserProfileImage = async (url: string) => {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, image: url }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update user image");
      }

      toast.success("Profile photo updated successfully");
    } catch (error) {
      toast.error("Could not update profile photo");
      console.error(error);
    }
  };

  // Handle file selection and preview
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
    setFile(selectedFile);
  };

  // Save the new profile photo
  const handleSave = async () => {
    if (!file) return;

    uploadToVercel(file).then((url) => {
      if (url) {
        updateUserProfileImage(url);
        setFile(null);
        setPreview(null);
      }
    });
  };

  return (
    <div className="shadow p-3">
      <Flex direction="column" gap={6} align="end">
        <Badge
          size="sm"
          variant="gradient"
          gradient={{ from: "lime", to: "green", deg: 90 }}
        >
          Verified
        </Badge>
      </Flex>

      <div className="relative flex items-center justify-center w-[130px] h-[130px] mt-4 mx-auto">
        {/* Rotating border animation */}
        <div className="absolute inset-0 w-full h-full rounded-full animate-spin-slow border-2 border-primary border-t-transparent"></div>

        <Group justify="center" className="p-3">
          <Avatar
            src={preview || user?.image || "https://via.placeholder.com/150"}
            size="120px"
            alt={preview ? "New profile preview" : "Profile photo"}
            className="rounded-full"
          />
        </Group>
      </div>

      <Group justify="center" align="center" mt="md">
        <FileInput
          accept="image/png,image/jpeg"
          placeholder="Update photo"
          onChange={handleFileChange}
          className="rounded-full"
        />
        <Button
          onClick={handleSave}
          disabled={!file || isUploading}
          loading={isUploading}
        >
          {isUploading ? "Uploading..." : "Save"}
        </Button>
      </Group>
    </div>
  );
};

export default UserProfile;
