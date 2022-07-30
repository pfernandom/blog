import React, { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import useMediaQuery from "src/helpers/use-media-query";

type ShareButtonsProps = {
  url: string;
  title: string;
  author: string;
  description: string;
  username?: string;
};

function ShareLink({
  className,
  href,
  children,
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <SocialIcon
      label={`Share this article to ${className}`}
      className="share-btn"
      fgColor="white"
      url={href}
      style={{ scale: 0.5 }}
      target="_blank"
      rel="noreferrer"
    />
  );
}

export default function ShareButtons({
  url,
  title,
  author,
  description,
  username = "pfernandom",
}: ShareButtonsProps) {
  const [isExpanded, setExpanded] = useState(false);

  function share() {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: description,
          url,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Share not supported on this browser, do it the old way.");
    }
  }

  useEffect(() => {
    if (navigator.share) {
      <SocialIcon
        className="expand-button"
        network="sharethis"
        label="Share to..."
        onClick={() => {
          share();
        }}
      ></SocialIcon>;
    }
  });

  return (
    <div className={`share-buttons`}>
      {/* Basic Share Links */}

      {/* Twitter (url, text, @mention) */}
      <ShareLink
        className="twitter"
        href={`https://twitter.com/share?url=${url}&text=${title}&via=${username}`}
      >
        Twitter
      </ShareLink>

      {/* Facebook (url) */}
      <ShareLink
        className="facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
      >
        Facebook
      </ShareLink>

      {/* Reddit (url, title) */}
      <ShareLink
        className="reddit"
        href={`https://reddit.com/submit?url=${url}&title=${title}`}
      >
        Reddit
      </ShareLink>

      {/* LinkedIn (url, title, summary, source url) */}
      <ShareLink
        className="linkedin"
        href={`https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${description}&source=${url}`}
      >
        LinkedIn
      </ShareLink>
    </div>
  );
}
