import React from "react";

import { NextPage } from "next";
import { getDataFile } from "../helpers/data-fetchers";
import { Metadata } from "../models/interfaces";

type ErrorParams = {
  metadata: Metadata;
};

const Error: NextPage<ErrorParams> = () => {
  return (
    <>
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </>
  );
};

export default Error;

export async function getStaticProps() {
  const metadata: Metadata = await getDataFile("src/data/metadata.json");

  return {
    props: {
      metadata,
    },
  };
}
