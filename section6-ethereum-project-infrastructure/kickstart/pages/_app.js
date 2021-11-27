import "../styles/index.css";
// this file doesn't become a route!!

import { metaMaskIsInstalled } from "../utils";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  if (metaMaskIsInstalled()) {
    // add event listener to detect change in ethereum networks, and reload page
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }

  return <Component {...pageProps} />;
}
