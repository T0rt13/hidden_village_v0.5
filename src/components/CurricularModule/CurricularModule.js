import React from 'react';
import Background from "../Background";
import { blue, white, red, green } from "../../utils/colors";
import Button from "../Button";
import RectButton from "../RectButton";
import { writeToDatabaseConjecture, writeToDatabaseDraft, getConjectureDataByUUID,getConjectureDataByAuthorID, getConjectureDataByPIN, getPoseDataByConjUUID } from "../../firebase/database";
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
        height={height * 0.12}
        width={width * 0.0950}
        x={width * 0.15}
        y={height * 0.52}
        color={blue}
        fontSize={21}
        fontColor={white}
        text={"Select Conjectures"}
        fontWeight={800}
        callback={null}
      />
      <Button
        height={height * 0.2}
        width={width * 0.1}
        x={width *0.90}
        y={height *0.52}
        color={blue}
        fontSize={24}
        fontColor={white}
        text={"New Conjecture"}
        fontWeight={800}
        callback={conjectureCallback}
      />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.58}
        y={height * 0.93}
        color={green}
        fontSize={width * 0.014}
        fontColor={white}
        text={"SAVE DRAFT"}
        fontWeight={800}
        callback={ () => writeToDatabaseDraft() } // Implement Save feature
      />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.45}
        y={height * 0.93}
        color={blue}
        fontSize={width * 0.015}
        fontColor={white}
        text={"PUBLISH"}
        fontWeight={800}
        callback={() => writeToDatabaseConjecture()} // publish to database
      />
      <CurricularContentEditor height={height} width={width} />
    </>
  );
};

export default CurricularModule;
