import React from 'react';
import Background from "../Background";
import { blue, white, red } from "../../utils/colors";
import Button from "../Button";
import { CurricularContentEditor } from "../CurricularModule/CurricularModuleBoxes";
import { useMachine } from "@xstate/react";
import { CurricularContentEditorMachine } from "../../machines/curricularEditorMachine";

const CurricularModule = (props) => {
  const { height, width, conjectureCallback, mainCallback } = props;
  const [state, send] = useMachine(CurricularContentEditorMachine);

  return (
    <>
      <Background height={height * 1.1} width={width} />
      <Button
        height={height * 0.12}
        width={width * 0.095}
        x={width * 0.06}
        y={height * 0.90}
        color={red}
        fontSize={width * 0.015}
        fontColor={white}
        text={"BACK"}
        fontWeight={800}
        callback={mainCallback} // Exit Back To Home
      />
      <Button
        height={height * 0.2}
        width={width * 0.1}
        x={width *0.90}
        y={height *0.9}
        color={blue}
        fontSize={24}
        fontColor={white}
        text={"Conjecture Editor"}
        fontWeight={800}
        callback={conjectureCallback}
      />
      <CurricularContentEditor height={height} width={width} />
    </>
  );
};

export default CurricularModule;
