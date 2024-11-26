import { Button, Flex, Group, TextInput, Card, Text } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import React, { useState } from 'react'

const SocialLinksPage = () => {
  const [links, setLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  })
  const [savedLinks, setSavedLinks] = useState<{ platform: string; url: string }[]>([]);
  const handleChange = (platform: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinks((prev) => ({ ...prev, [platform]: event.target.value }));
  };
  const handleSave = () => {
    const newLinks = Object.entries(links)
      .filter(([_, url]) => url.trim() !== "") // Ignore empty links
      .map(([platform, url]) => ({ platform, url }));

    setSavedLinks(newLinks);
    setLinks({
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    });
  };


  return (
    <Flex direction="column" gap={20} maw={400} mx="auto">
      <TextInput
        placeholder="Facebook"
        value={links.facebook}
        onChange={handleChange("facebook")}
        rightSection={<IconBrandFacebook />}
      />
      <TextInput
        placeholder="Twitter"
        value={links.twitter}
        onChange={handleChange("twitter")}
        rightSection={<IconBrandTwitter />}
      />
      <TextInput
        placeholder="Instagram"
        value={links.instagram}
        onChange={handleChange("instagram")}
        rightSection={<IconBrandInstagram />}
      />
      <TextInput
        placeholder="LinkedIn"
        value={links.linkedin}
        onChange={handleChange("linkedin")}
        rightSection={<IconBrandLinkedin />}
      />
      <Button onClick={handleSave}>Save</Button>

      <Flex direction="column" gap={10}>
        {savedLinks.length > 0 && (
          <Text size="lg" fw={500}>
            Saved Links:
          </Text>
        )}
        {savedLinks.map(({ platform, url }, index) => (
          <Card key={index} shadow="sm" padding="sm" radius="md" withBorder>
            <Text fw={500}>{platform}</Text>
            <Text>{url}</Text>
          </Card>
        ))}
      </Flex>
    </Flex>
  )
}

export default SocialLinksPage
