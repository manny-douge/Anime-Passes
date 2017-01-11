import React, { Component } from 'react';

function NavBar() {

  const leftGroup = (
    <div className="navbar-header" >

      <button type="button" className="navbar-toggle" id="collapse-btn" data-toggle="collapse" data-target="#right-group">
      <span className="icon-bar"></span>
      <span className="icon-bar"></span>
      <span className="icon-bar"></span>
      </button>

      <img id="logo" className="hvr-grow" src="http://www.placehold.it/110x70"></img>
    </div>
  );

  const rightGroup = (
    <div className="collapse navbar-collapse menu-solid" id="right-group">
      <ul className="nav navbar-nav navbar-right">
        <li><a href="#"><p className="navbar-text" id="nav-text">Contact Us</p></a></li>
        <li><a href="#"><i className="fa fa-github fa-4x"></i></a></li>
      </ul>
    </div>
  );

  return (
    <nav className="navbar navbar-fixed-top navbar-inverse"  id="nav">
    <div className="container-fluid">
      {leftGroup}
      {rightGroup}
    </div>
    </nav>
  );

}

export default NavBar;
