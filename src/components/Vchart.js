import React, { Component } from "react";
import "./styles/Vchart.css";
class Vchart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  calculator(min, max, item) {
    const dis = max - min;
    const reducedItem = item - min;
    var result = Math.round((reducedItem * 100) / dis);
    result = result > 100 ? 100 : result;
    return result;
  }
  poinMaker(items, bottom, left, secondDataItem) {
    console.log("injaItems: ", items);
    const classitem = secondDataItem ? "pointItem second" : "pointItem";
    return (
      <div
        className={classitem}
        style={{
          left: left,
          bottom: bottom
        }}
      >
        {items && (
          <ul>
            {items.map(item => {
              return <li>{item.name}</li>;
            })}
          </ul>
        )}
        <label />
      </div>
    );
  }

  render() {
    const { data, xLabels, yLabels, yRightLabels, secondData } = this.props;
    var bottom = 0;
    var left = 0;
    const RightBorder = yRightLabels ? "rightBorderOn" : "";
    return (
      <div className="chartContainer">
        <div className={`chartArea ${RightBorder}`}>
          <div className="xLabelsRowStyle">
            {xLabels.data &&
              xLabels.data.map(item => {
                return (
                  <label
                    className="xLabelsStyle"
                    style={{
                      left: `${this.calculator(
                        xLabels.min.unix(),
                        xLabels.max.unix(),
                        item.unix()
                      )}%`
                    }}
                  >
                    {item.format("MMMYYYY")}
                  </label>
                );
              })}
          </div>
          {xLabels.data &&
            xLabels.data.map(item => {
              return (
                <div
                  className="xLineStyle"
                  style={{
                    left: `${this.calculator(
                      xLabels.min.unix(),
                      xLabels.max.unix(),
                      item.unix()
                    )}%`
                  }}
                />
              );
            })}

          <div className="yLabelsRowStyle">
            {yLabels.data &&
              yLabels.data.map(item => {
                return (
                  <label
                    className="yLabelsStyle"
                    style={{
                      bottom: `${this.calculator(
                        yLabels.min,
                        yLabels.max,
                        item
                      )}%`
                    }}
                  >
                    {item}
                  </label>
                );
              })}
          </div>
          {yRightLabels && (
            <div className="yRightLabelsRowStyle">
              {yRightLabels.data &&
                yRightLabels.data.map(item => {
                  return (
                    <label
                      className="yLabelsStyle"
                      style={{
                        bottom: `${this.calculator(
                          yRightLabels.min,
                          yRightLabels.max,
                          item
                        )}%`
                      }}
                    >
                      {item}
                    </label>
                  );
                })}
            </div>
          )}
          {yLabels.data &&
            yLabels.data.map(item => {
              return (
                <div
                  className="yLineStyle"
                  style={{
                    bottom: `${this.calculator(
                      yLabels.min,
                      yLabels.max,
                      item
                    )}%`
                  }}
                />
              );
            })}

          {data &&
            data.map(item => {
              const bottom =
                this.calculator(
                  yLabels.min,
                  yLabels.max,
                  parseInt(item.y)
                ).toString() + "%";
              const left =
                this.calculator(
                  xLabels.min.unix(),
                  xLabels.max.unix(),
                  item.x.unix()
                ).toString() + "%";
              return this.poinMaker(item.items, bottom, left);
            })}
          {secondData &&
            secondData.map(item => {
              const bottom =
                this.calculator(
                  yRightLabels.min,
                  yRightLabels.max,
                  parseInt(item.y)
                ).toString() + "%";
              const left =
                this.calculator(
                  xLabels.min.unix(),
                  xLabels.max.unix(),
                  item.x.unix()
                ).toString() + "%";
              return this.poinMaker(item.items, bottom, left, true);
            })}
        </div>
      </div>
    );
  }
}

export default Vchart;
