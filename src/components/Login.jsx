import React from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/login.css';

class Login extends React.Component {
  state = {
    name: '',
    firstJumin: '',
    lastJumin: '',
    accessKey: '',
    secretKey: '',
  };

  onChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  onChangeFirstJumin(event) {
    this.setState({
      firstJumin: event.target.value,
    });
  }

  onChangeLastJumin(event) {
    this.setState({
      lastJumin: event.target.value,
    });
  }

  onChangeAccessKey(event) {
    this.setState({
      accessKey: event.target.value,
    });
  }

  onChangeSecretKey(event) {
    this.setState({
      secretKey: event.target.value,
    });
  }

  handleFormSubmit(formSubmitEvent) {
    formSubmitEvent.preventDefault();
    const { accessKey, secretKey } = this.state;
    // eslint-disable-next-line react/prop-types
    const { history } = this.props;
    const url = new URL('http://localhost:4000/setKey');
    fetch(url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessKey,
        secretKey,
      }),
    }).then(() => {
      history.push('/home');
    });
  }

  render() {
    const {
      name, firstJumin, lastJumin, accessKey, secretKey,
    } = this.state;
    return (
      <div className="login">
        <div className="title">Sign in to TaxSaver</div>
        <div className="user-input-container">
          <div className="user-info-box">
            <div className="name">
              <span>Name</span>
              <input placeholder="" value={name} onChange={this.onChangeName.bind(this)} />
            </div>
            <div className="jumin">
              <span>주민등록번호</span>
              <div className="jumin-input">
                <input
                  placeholder=""
                  value={firstJumin}
                  onChange={this.onChangeFirstJumin.bind(this)}
                />
                <div className="hyphen">-</div>
                <input
                  placeholder=""
                  value={lastJumin}
                  onChange={this.onChangeLastJumin.bind(this)}
                />
              </div>
            </div>
          </div>
          <div className="user-info-box user-key-box">
            <div className="access-key">
              <span>Access key</span>
              <input
                placeholder=""
                value={accessKey}
                onChange={this.onChangeAccessKey.bind(this)}
              />
            </div>
            <div className="secret-key">
              <span>Secret key</span>
              <input
                placeholder=""
                value={secretKey}
                onChange={this.onChangeSecretKey.bind(this)}
              />
            </div>
            <button type="submit" onClick={this.handleFormSubmit.bind(this)}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
