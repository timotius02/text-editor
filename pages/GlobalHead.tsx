import Head from "next/head";

export default function GlobalHead() {
  return (
    <Head>
      <title>Text Editor using Slate</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content="Experimental Text Editor made using Slate"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
