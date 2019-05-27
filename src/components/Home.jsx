import React from 'react';
import '../styles/home.css';

const TARGET = {
  PERSONAL: 'personal',
  CORPORATE: 'corporate',
};

class Home extends React.Component {
  state = {
    records: null,
    target: TARGET.PERSONAL,
    taxResult: null,
  };

  componentDidMount() {
    this.requestRecords();
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
    const { records, target } = this.state;
    console.log(target);
    const totalGain = records.reduce(
      (acc, cur) => acc + (cur.side === 'ask' ? parseInt(cur.price, 10) : 0),
      0,
    );
    const totalLoss = records.reduce(
      (acc, cur) => acc + (cur.side === 'bid' ? parseInt(cur.price, 10) : 0),
      0,
    );
    const totalIncome = totalGain - totalLoss;
    let range;
    let percentage;

    if (target === TARGET.PERSONAL) {
      if (totalIncome <= 12000000) {
        range = '1200만원 이하';
        percentage = 6;
      } else if (totalIncome <= 46000000) {
        range = '1200만원 초과 4600만원 이하';
        percentage = 15;
      } else if (totalIncome <= 88000000) {
        range = '4600만원 초과 8800만원 이하';
        percentage = 24;
      } else if (totalIncome <= 150000000) {
        range = '8800만원 초과 1억 5000만원 이하';
        percentage = 35;
      } else if (totalIncome <= 300000000) {
        range = '1억 5000만원 초과 3억원 이하';
        percentage = 38;
      } else if (totalIncome <= 500000000) {
        range = '3억원 초과 5억원 이하';
        percentage = 40;
      } else {
        range = '5억원 초과';
        percentage = 42;
      }
    } else if (totalIncome <= 200000000) {
      range = '2억원 이하';
      percentage = 10;
    } else if (totalIncome <= 20000000000) {
      range = '2억원 초과 200억원 이하';
      percentage = 20;
    } else if (totalIncome <= 300000000000) {
      range = '200억원 초과 3000억원 이하';
      percentage = 22;
    } else {
      range = '3000억원 초과';
      percentage = 25;
    }

    const totalTax = totalIncome > 0 ? Math.floor((totalIncome * percentage) / 100) : 0;

    this.setState({
      taxResult: {
        totalGain,
        totalLoss,
        totalIncome,
        range,
        percentage,
        totalTax,
      },
    });
  }

  render() {
    const { records, target, taxResult } = this.state;
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
          {records
            && records.map((record, index) => (
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
      <div className="home">
        <form className="tax-calculator-box" onSubmit={this.handleFormSubmit.bind(this)}>
          <div className="title">Tax calculator</div>
          <div className="target">
            <span>target</span>
            <label>
              <input
                type="radio"
                value="personal"
                checked={target === TARGET.PERSONAL}
                onChange={this.handleTargetChange.bind(this)}
              />
              Personal
            </label>
            <label>
              <input
                type="radio"
                value="corporate"
                checked={target === TARGET.CORPORATE}
                onChange={this.handleTargetChange.bind(this)}
              />
              Corporate
            </label>
          </div>
          <button className="btn btn-default" type="submit">
            Calculate tax
          </button>
        </form>
        {taxResult && (
          <div className="tax-result-box">
            <div className="income-part">
              <div className="total-gain">
                <div className="tag">Total gain</div>
                <div className="value">{`+${taxResult.totalGain}원`}</div>
              </div>
              <div className="total-loss">
                <div className="tag">Total loss</div>
                <div className="value">{`-${taxResult.totalLoss}원`}</div>
              </div>
              <div className="total-income">
                <div className="tag">Total income</div>
                <div className="value">
                  {`${taxResult.totalIncome >= 0 ? '+' : ''}${taxResult.totalIncome}원`}
                </div>
              </div>
            </div>
            <div className="tax-part">
              <div className="range">
                <div className="tag">소득 구간</div>
                <div className="value">{taxResult.range}</div>
              </div>
              <div className="percentage">
                <div className="tag">소득세율</div>
                <div className="value">{`${taxResult.percentage}%`}</div>
              </div>
              <div className="total-tax">
                <div className="tag">예상 소득세 금액</div>
                <div className="value">{`${taxResult.totalTax}원`}</div>
              </div>
            </div>
          </div>
        )}
        <div className="table-container">{records && recordTable}</div>
      </div>
    );
  }
}

export default Home;
