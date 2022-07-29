import React from "react";
import { SocialIcon } from "react-social-icons";

export default function SocialPane() {
  return (
    <div
      style={{
        position: "fixed",
        top: "2em",
        right: "1em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SocialIcon
        url="https://www.instagram.com/pedro.marquez.soto/"
        style={{ marginBottom: "10px" }}
      />
      <SocialIcon
        url="https://www.linkedin.com/in/pedro-fernando-m%C3%A1rquez-soto-1218a345/"
        style={{ marginBottom: "10px" }}
      />
      <SocialIcon
        url="https://medium.com/@pfernandom"
        style={{ marginBottom: "10px" }}
      />
      <SocialIcon network="rss" url="https://medium.com/rss/atom.xml" />
    </div>
  );
}
