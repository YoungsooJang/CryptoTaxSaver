import React from 'react';
import './App.css';

const TARGET = {
  PERSONAL: 'personal',
  CORPORATE: 'corporate',
};

class App extends React.Component {
  state = {
    records: null,
    accessKey: '89NRuxCnfR7bBVAtNPbZFbrYsjksIc3pEgUj4cJI',
    secretKey: 'oSqklGu32Hrmp9eGD2Qxa4W2nsXzVJQxYWQqY1kN',
    target: TARGET.PERSONAL,
    taxResult: null,
  };

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

  requestRecords() {
    const { accessKey, secretKey } = this.state;
    const url = new URL('http://localhost:4000/api/getOrders');
    const params = { accessKey, secretKey };
    url.search = new URLSearchParams(params);
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        const body = JSON.parse(res.body);
        this.setState({ records: body.error !== undefined ? [] : body });
      });
  }

  handleTargetChange(changeEvent) {
    this.setState({
      target: changeEvent.target.value,
    });
  }

  handleFormSubmit(formSubmitEvent) {
    formSubmitEvent.preventDefault();
    const { target } = this.state;
    console.log('You have selected:', target);
    this.setState({
      taxResult: 1,
    });
  }

  render() {
    const {
      records, accessKey, secretKey, target, taxResult,
    } = this.state;
    const recordTable = (
      <table className="record-table">
        <thead>
          <tr>
            {/* <th>uuid</th> */}
            <th>side</th>
            {/* <th>ord_type</th> */}
            <th className="align-right">price</th>
            {/* <th>state</th> */}
            <th>market</th>
            <th className="align-right">volume</th>
            {/* <th>remaining_volume</th> */}
            {/* <th>reserved_fee</th> */}
            {/* <th>remaining_fee</th> */}
            {/* <th>paid_fee</th> */}
            {/* <th>locked</th> */}
            {/* <th>executed_volume</th> */}
            {/* <th>trades_count</th> */}
            <th>created_at</th>
          </tr>
        </thead>
        <tbody>
          {records && records.map((record, index) => (
          // eslint-disable-next-line react/no-array-index-key
            <tr key={`record_${index}`}>
              {/* <td>{record.uuid}</td> */}
              <td className={record.side}>{record.side}</td>
              {/* <td>{record.ord_type}</td> */}
              <td className="align-right">
                {parseInt(record.price, 10)}
                <span>원</span>
              </td>
              {/* <td>{record.state}</td> */}
              <td>{record.market}</td>
              <td className="align-right">{record.volume}</td>
              {/* <td>{record.remaining_volume}</td> */}
              {/* <td>{record.reserved_fee}</td> */}
              {/* <td>{record.remaining_fee}</td> */}
              {/* <td>{record.paid_fee}</td> */}
              {/* <td>{record.locked}</td> */}
              {/* <td>{record.executed_volume}</td> */}
              {/* <td>{record.trades_count}</td> */}
              <td>{record.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div className="App">
        <div className="user-input-container">
          <div className="user-input-box">
            <div className="access-key">
              <span>access key</span>
              <input
                placeholder="access key"
                value={accessKey}
                onChange={this.onChangeAccessKey.bind(this)}
              />
            </div>
            <div className="secret-key">
              <span>secret key</span>
              <input
                placeholder="secret key"
                value={secretKey}
                onChange={this.onChangeSecretKey.bind(this)}
              />
            </div>
            <button type="submit" onClick={this.requestRecords.bind(this)}>
              거래 내역 받아오기
            </button>
          </div>
          <div className="tax-calculator-box">
            <div className="title">Tax calculator</div>
            <form onSubmit={this.handleFormSubmit.bind(this)}>
              <span>target</span>
              <div className="labels">
                <label>
                  <input
                    type="radio"
                    value="personal"
                    checked={target === TARGET.PERSONAL}
                    onChange={this.handleTargetChange.bind(this)}
                  />
                개인
                </label>
                <label>
                  <input
                    type="radio"
                    value="corporate"
                    checked={target === TARGET.CORPORATE}
                    onChange={this.handleTargetChange.bind(this)}
                  />
                법인
                </label>
              </div>
              <button className="btn btn-default" type="submit">세금 계산하기</button>
            </form>
          </div>
        </div>
        {taxResult && (
          <div className="tax-result-container">
            <div className="tax-result-box">
              <div className="income-part">
                <div className="total-gain">
                  <div className="tag">Total gain</div>
                  <div className="value">+ 9485500원</div>
                </div>
                <div className="total-loss">
                  <div className="tag">Total loss</div>
                  <div className="value">- 2983500원</div>
                </div>
                <div className="total-income">
                  <div className="tag">Total income</div>
                  <div className="value">+ 6508000원</div>
                </div>
              </div>
              <div className="tax-part">
                <div className="range">
                  <div className="tag">소득 구간</div>
                  <div className="value">1200만원 초과 4600만원 이하</div>
                </div>
                <div className="percentage">
                  <div className="tag">소득세율</div>
                  <div className="value">15%</div>
                </div>
                <div className="total-tax">
                  <div className="tag">예상 소득세 금액</div>
                  <div className="value">500000원</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="table-container">
          {records && recordTable}
        </div>
      </div>
    );
  }
}

export default App;
