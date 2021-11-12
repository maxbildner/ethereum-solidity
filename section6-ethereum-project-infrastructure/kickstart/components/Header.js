import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes"; // configuration object from next-routes library

const Header = (props) => {
  return (
    <Menu style={{ marginTop: "15px" }}>
      {/* Link wraps stuff between it in click event handler (does not auto create anchor tags?) */}
      <Link route="/">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>

        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
