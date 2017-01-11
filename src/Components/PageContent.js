import React, { Component } from 'react';
import CustomForm from "./CustomForm";

function PageContent() {

  const header = (
    <div className="col-md-12">
    <h2>Free Guest Passes for Crunchyroll updated hourly</h2>
    </div>

  );
  const aboutSite = (
    <div className="col-md-12">
    <h4>Anime Passes seeks to ease the hassle of finding a Crunchyroll Guest
    Pass, whether you're someone who's subscription has run out or someone
    just wanting to get their hands on an account.
    </h4>
    </div>
  );

  const donateDiv = (
    <div className="col-md-5 col-sm-5 col-xs-12 mc-item text-center" id="donate">
    <p>All Guest Passes be verified for authenticity upon submission.</p>
    <p>Don't worry about submitting passes you're unsure about <b>:-)</b>.</p>
    <CustomForm buttonType="donate"/>

    </div>
  );

  const requestDiv = (
    <div className="col-md-5 col-sm-2 col-xs-12 mc-item">
    <p>Anime Passes is supported by the <b>Anime and Crunchyroll communities</b>, all
    guest passes given have been donated by another user.</p>
    <p>
    As such, there is a 48 hour restriction after each successful acquisition
    of a Guest Pass.
    </p>
    <p><b>Please be respectful</b>.</p>
    <CustomForm buttonType="request"/>
    </div>

  );

  return (
    <div className="row container-fluid text-center">
      {header}
      {aboutSite}
      <div className="col-md-10 col-sm-10 col-xs-10 row" id="main-content">
        {donateDiv}
        <div className="col-md-2 col-sm-2 col-xs-12">
          <div id="divider"></div>
        </div>
        {requestDiv}
        </div>
    </div>

  );

}

export default PageContent;
