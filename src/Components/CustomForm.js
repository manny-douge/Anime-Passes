import React, { Component } from 'react';

class CustomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: String(event.target.value).trim().toUpperCase()
    });
  }

  handleSubmit(event) {
    let value = this.state.value;
    if ((this.props.buttonType === "donate") && value !== "") {
      alert("You submitted a Code, " + this.state.value)
    } else if (this.props.buttonType === "request") {
      alert("You requested a Code")
    }
    event.preventDefault();
  }

  render() {
    const buttonType = this.props.buttonType

    return (
      <form onSubmit={this.handleSubmit} style={{color:"black"}}>
      {buttonType==="donate" ? (
        <div>
          <input id="donate-input" placeholder="Guest Pass Code" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value ="Donate" type="submit" className="btn mc-btn"/>

        </div>
      ):
      (
        <input id="request-btn" value ="Request" type="submit" className="btn mc-btn"/>
      ) }
      </form>
    )
  }
}

export default CustomForm;
