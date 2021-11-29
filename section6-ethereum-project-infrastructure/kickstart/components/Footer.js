import React from "react";

const GIT_REPO_URL =
  "https://github.com/maxbildner/ethereum-solidity/tree/main/section6-ethereum-project-infrastructure/kickstart";

const Footer = (props) => {
  return (
    <div className="footer-wrap">
      <div className="footer">
        <a href={GIT_REPO_URL} target="_blank" className="git-url">
          Git Repo
        </a>
        <span className="divider">|</span>
        <span className="name">Max Bildner</span>
      </div>
    </div>
  );
};

export default Footer;
