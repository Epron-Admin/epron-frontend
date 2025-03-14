import React, { useState, useEffect } from "react";
import { formatNumber } from "../../../../utils/helper";
import Card from "./Card";
import { cardInfo } from "../navigation";

function CardSection({ role, data }) {
  const [cardData, setCardData] = useState([]);
  const [cardVal, setCardVal] = useState([]);

  useEffect(() => {
    if (data) {
      setCardData(data);
      setCardVal(Object.values(cardData));
    }
  }, [data, cardData]);
  let cardText = cardInfo[role === "producer" ? "manufacturer" : role];
  // let cardVal = cardData.length > 0 && Object.values(cardData);
  return (
    <div className="cards grid grid-cols-2 md:grid-cols-3">
      {cardText.map((item, index) => (
        <Card
          key={index}
          val={
            cardVal[index] || 0
          }
          text={item}
        />
      ))}
    </div>
  );
}

export default CardSection;
