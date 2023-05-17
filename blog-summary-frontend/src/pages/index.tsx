import React from "react";

import { Main } from "components";

const Home: React.FC = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" , backgroundColor:"#282c34", fontSize:"23px", color:"#FFF"}}
    >
      <Main />
    </div>
  );
};

export default Home;
