import React from "react";
import { SocialIcon } from "react-social-icons";
import Image from "src/components/image";
import profilePic from "../../public/profile-pic.jpg";

import { rhythm } from "../utils/typography";
import { Metadata } from "../models/interfaces";

function Bio({ metadata }: { metadata: Metadata }) {
  const { author } = metadata;
  return (
    <div
      style={{
        marginBottom: rhythm(1),
      }}
    >
      <div className="link-post-container">
        <div style={{ padding: "1em" }}>
          <Image
            src={profilePic}
            alt={author}
            className="circle-image"
            width={70}
            height={70}
            objectFit="cover"
            style={{ flexBasis: "105em" }}
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
