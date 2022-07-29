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
        zIndex: 2,
      }}
    >
      <SocialIcon
        url="https://www.instagram.com/pedro.marquez.soto/"
        fgColor="white"
        style={{ marginBottom: "10px" }}
      />
      <SocialIcon
        url="https://www.linkedin.com/in/pedro-fernando-m%C3%A1rquez-soto-1218a345/"
        fgColor="white"
        style={{ marginBottom: "10px" }}
      />
      <SocialIcon
        url="https://medium.com/@pfernandom"
        fgColor="white"
        style={{ marginBottom: "10px" }}
      />
      <SocialIcon
        network="rss"
        fgColor="white"
        url="https://medium.com/rss/atom.xml"
      />
    </div>
  );
}
