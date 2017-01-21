import React, { Component } from 'react';
import $ from 'jquery'

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
    if ((this.props.buttonType === "donate") && value.length === 11) {
      //hide button show loader
      $("#donate-btn").toggle()
      $("#donate-ldr").toggle()
      $.get(`http://localhost:3030/donate?gp=${value}`, function(data, status) {
        if (status === "success") {
          // console.log("Success receiving data.")
          $("#donate-btn").toggle()
          $("#donate-ldr").toggle()
          $("#donate-input").text("")
          $("#donate-input").focus()
          alert("Thanks!")
        }
      })
    } else if (this.props.buttonType === "request") {
      $("#request-btn").toggle()
      $("#request-ldr").toggle()
      $("#code").text("This may take a few moments...")
      $.get(`http://localhost:3030/request?${value}`, function(data, status) {
        if (status === "success") {
          // console.log("Success receiving data.")
          $("#request-btn").toggle()
          $("#request-ldr").toggle()
          $("#code").text(data)
        }
      })
    }
    event.preventDefault();
  }

  render() {
    const buttonType = this.props.buttonType

    return (
      <form onSubmit={this.handleSubmit} style={{color:"black"}}>
      {buttonType==="donate" ? (
        <div>
          <input id="donate-input" maxLength="11" placeholder="Guest Pass Code" value={this.state.value} onChange={this.handleChange} />
          <div id="donate-ldr" className="loader"></div>
          <input id="donate-btn" type="submit" value ="Donate" type="submit" className="btn mc-btn hvr-grow" required />

        </div>
      ):
      (
        <div>
        <div id="request-ldr" className="loader"></div>
        <input id="request-btn" value ="Request" type="submit" className="btn mc-btn hvr-grow"/>
        </div>
      ) }
      </form>
    )
  }
}

export default CustomForm;
