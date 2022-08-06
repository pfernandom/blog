import React from "react";
import { SocialIcon } from "react-social-icons";
import Image from "src/components/image";
import profilePic from "../../public/profile-pic.jpg";

import { Metadata } from "../models/interfaces";

function Bio({ metadata }: { metadata: Metadata }) {
  const { author } = metadata;
  return (
    <div
      style={{
        marginBottom: "1em",
      }}
    >
      <div className="link-post-container">
        <div className="circle-image-container bio-image">
          <Image
            src={profilePic}
            alt={author}
            className="circle-image"
            width={70}
            height={70}
            objectFit="cover"
          />
        </div>
        <p>
          Written by <strong>{author}</strong> who lives and works in Austin,
          Texas, doing all things front-end (and some back-end too).
        </p>
      </div>
    </div>
  );
}

export default Bio;
