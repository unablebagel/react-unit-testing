import React, { useEffect, useState } from "react";
import { FetchData } from "../utils/services";

const TestingAPICalls = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    FetchData().then((data) => {
      setData(data);
    });
  });

  return (
    <div>
      {data.map((item, index) => (
        <div key={`${item.name}-${index}`}>{item.name}</div>
      ))}
    </div>
  );
};

export default TestingAPICalls;
