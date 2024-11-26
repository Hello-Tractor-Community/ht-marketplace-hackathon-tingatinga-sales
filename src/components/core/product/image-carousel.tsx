"use client";

import React from "react";
import ImageGallery from "react-image-gallery";

const images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    originalAlt: "originalAlt",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    originalAlt: "originalAlt",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    originalAlt: "originalAlt",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

const ImageCarousel = ({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) => {
  const items = images.map((image) => ({
    original: image,
    originalAlt: productName,
    thumbnail: image,
  }));

  return (
    <div className="w-full md:w-[780px]">
      <ImageGallery
        items={items}
        lazyLoad
        showNav={false}
        showPlayButton={false}
        disableSwipe={false}
        showFullscreenButton={false}
      />
    </div>
  );
};

export default ImageCarousel;
