import React from "react";
const Vmodal = ({ displayStatus, data, closeFunc }) => {
  let display = "none";
  if (displayStatus) {
    display = "flex";
  }
  return (
    <section className="valertSection" style={{ display: display }}>
      <div className="valertContianer vModal">
        {closeFunc && (
          <i className="fas fa-times closeIcon" onClick={closeFunc} />
        )}
        {data}
      </div>
    </section>
  );
};
export default Vmodal;
