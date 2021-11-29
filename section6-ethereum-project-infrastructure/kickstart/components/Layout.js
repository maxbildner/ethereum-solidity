import React from "react";
import Header from "./Header";
import Head from "next/head";
import { Container } from "semantic-ui-react";
import Footer from "./Footer";
import "semantic-ui-css/semantic.min.css";

const Layout = (props) => {
  return (
    <Container>
      <div className="content">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Header />
        {/* props.children represents all JSX inbetween Layout component tags */}
        {props.children}
      </div>

      <Footer />
    </Container>
  );
};

export default Layout;
