"use client";

import Snowfall from "react-snowfall";

const SnowfallComponent = () => {
  return (
    <Snowfall
      snowflakeCount={20}
      changeFrequency={200}
      opacity={[0.3, 0.8]}
      wind={[-2, 4]}
    />
  );
};

export { SnowfallComponent };
