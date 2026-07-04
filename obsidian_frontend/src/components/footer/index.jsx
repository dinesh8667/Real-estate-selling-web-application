import React from "react";
import "./style.scss";

function index() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2>MintFizo Estate</h2>

        <p>
          Premium real estate portal for modern investors
          <br />
          and luxury homebuyers.
        </p>

        <span>
          © 2024 MintFizo Estate. All rights reserved.
        </span>
      </div>

      <div className="footer-links">
        <div className="footer-column">
          <a href="/">Support</a>
          <a href="/">Privacy</a>
        </div>

        <div className="footer-column">
          <a href="/">Social</a>
          <a href="/">Newsletter</a>
        </div>
      </div>
    </footer>
  );
}

export default index;