import React, { useState, useEffect } from 'react';
import Background from "../Background";
import { blue, white, red, neonGreen,green, black } from "../../utils/colors";
import RectButton from "../RectButton";
import { getConjectureList, searchConjecturesByWord } from "../../firebase/database";
import { ConjectureSelectorBoxes } from "./ConjectureSelectorModuleBoxes";
import { useMachine } from "@xstate/react";
import { CurricularContentEditorMachine } from "../../machines/curricularEditorMachine";
import {Curriculum} from "../CurricularModule/CurricularModule";
import {currentConjecture} from "../ConjectureModule/ConjectureModule"
import { getConjectureDataByUUID } from "../../firebase/database";

import InputBox from '../InputBox';

export let curricularSelect = false; // keep track of whether the conjecture selector is used for curricular purposes or editing existing conjectures.

export function getCurricularSelect() {
  return curricularSelect;
}
export function setCurricularSelect(trueOrFalse) {
  curricularSelect = trueOrFalse;
}

export function handlePIN(conjecture, message = "Please Enter the PIN."){ // this function is meant to be used as an if statement (ex: if(handlePIN){...} )
  const existingPIN = conjecture["PIN"];
  const enteredPIN = prompt(message);

  if(existingPIN == "" || enteredPIN == existingPIN){ // PIN is successful
    return true;
  }
  else if(enteredPIN != null && enteredPIN != ""){ // recursively try to have the user enter a PIN when it is incorrect
    return handlePIN(conjecture, message = "Incorrect PIN, please try again.");
  }
  return false; // do nothing if cancel is clicked
}

const ConjectureSelectModule = (props) => {
  
  const { height, width, conjectureCallback, backCallback, curricularCallback} = props;
  const [conjectureList, setConjectureList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);


  const [state, send] = useMachine(CurricularContentEditorMachine);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getConjectureList(curricularSelect);
        setConjectureList(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  //use to get a fixed number of conjectures per page and to navigate between the pages
  const conjecturesPerPage = 7;
  const totalPages = Math.ceil(conjectureList.length / conjecturesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const searchConjectures = async (searchWord) => {
    try{
      console.log("Search Button")
      const result = await searchConjecturesByWord(searchWord);
      console.log(result)

      setConjectureList(result);
    }
    catch (error){
      console.log("No conjectures found")
    }
    
  };

  // use to determine the subset of conjectures to display based on the current page
  const startIndex = currentPage * conjecturesPerPage;
  const currentConjectures = conjectureList.slice(startIndex, startIndex + conjecturesPerPage);

  // draw the buttons that show the author name, name of conjecture, and keywords, and the add conjecture button
  const drawConjectureList = (xMultiplier, yMultiplier, fontSizeMultiplier, totalWidth, totalHeight) => {
    return (
      <>
        {currentConjectures.map((conjecture, index) => (
          <RectButton
            key={index}
            height={totalHeight /2 * yMultiplier}
            width={totalWidth * 0.8}
            x={totalWidth * (xMultiplier-0.08)}
            y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75}
            color={white}
            fontSize={totalWidth * fontSizeMultiplier/1.3}
            fontColor={blue}
            text={conjecture["Text Boxes"]["Author Name"]}
            fontWeight="bold"
            callback = {() => {
              if(handlePIN(conjecture)){
                currentConjecture.setConjecture(conjecture);
                conjectureCallback(conjecture);
              }
            }}
          />
        ))}

        {currentConjectures.map((conjecture, index) => (
          <RectButton
            key={'author' + index}
            height={totalHeight / 2 * yMultiplier}
            width={totalWidth * 0.6}
            x={totalWidth * (xMultiplier + 0.25)}
            y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75}
            color={white}
            fontSize={totalWidth * fontSizeMultiplier / 1.3} 
            fontColor={blue}
            text={conjecture["Text Boxes"]["Conjecture Name"]}
            fontWeight="bold"
            callback = {() => {
              if(handlePIN(conjecture)){
                currentConjecture.setConjecture(conjecture);
                conjectureCallback(conjecture);
              }
            }}
          />
        
        ))}

        {currentConjectures.map((conjecture, index) => (
          <RectButton
            key={'keywords' + index}
            height={totalHeight / 2 * yMultiplier}
            width={totalWidth * 0.8}
            x={totalWidth * (xMultiplier +0.5)} 
            y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75} 
            color={white}
            fontSize={totalWidth * fontSizeMultiplier / 1.3}
            fontColor={blue}
            text={conjecture["Text Boxes"]["Conjecture Keywords"]}
            fontWeight="bold"
            callback = {() => {
              if(handlePIN(conjecture)){
                currentConjecture.setConjecture(conjecture);
                conjectureCallback(conjecture);
              }
            }}
          />
        ))}

        {/* only show these in the curricular editor (disabled when just editing conjecture) */}
        {curricularSelect ? (
          currentConjectures.map((conjecture, index) => (
            <RectButton
              key={index}
              height={0.01}
              width={0.01}
              x={totalWidth * xMultiplier - totalWidth * xMultiplier *0.7}
              y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier - totalHeight * yMultiplier *0.15 }
              color={white}
              fontSize={totalWidth * fontSizeMultiplier * 2}
              fontColor={neonGreen}
              text={"+"}
              fontWeight="bold"
              callback = {() => {
                  Curriculum.addConjecture(conjecture);
                  curricularCallback();
              }}
            />
          )))
          // show whether the conjectures are drafts or finals in the level editor
          :(currentConjectures.map((conjecture, index) => (
            <RectButton
              key={index}
              height={totalHeight / 2 * yMultiplier}
              width={totalWidth * (xMultiplier * 0.85 )}
              x={totalWidth * xMultiplier - totalWidth * xMultiplier * 0.95}
              y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75 }
              color={white}
              fontSize={totalWidth * fontSizeMultiplier / 1.3}
              fontColor={blue}
              text={conjecture["isFinal"] ? "X" : " "}
              fontWeight="bold"
              callback = {() => {
                if(handlePIN(conjecture)){
                  currentConjecture.setConjecture(conjecture);
                  conjectureCallback(conjecture);
                }
              }}
            />
          ))
            
          )  
        }
      </>
    );
  };

  const [search, setSearch] = useState("search by one word");
  function sendSearchPrompt(){
    let enteredSearch = prompt("Please Enter a Word to Search Conjectures", search);
    if (enteredSearch !== null) {
      setSearch(enteredSearch)
    } else if (enteredSearch !== null) {
    alert('Error reading search: No value');
    }

  } 

  return (
    <>
      <Background height={height * 1.1} width={width} />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.15}
        y={height * 0.93}
        color={blue}
        fontSize={width * 0.014}
        fontColor={white}
        text={"PREVIOUS"}
        fontWeight={800}
        callback={prevPage}
      />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.56}
        y={height * 0.93}
        color={blue}
        fontSize={width * 0.014}
        fontColor={white}
        text={"NEXT"}
        fontWeight={800}
        callback={nextPage}
      />

      {/* This is my search button */}
      <RectButton
        height={height * .13}
        width={width * 0.26}
        x={width * 0.9}
        y={height * 0.05}
        color={blue}
        fontSize={width * 0.014}
        fontColor={white}
        text={"SEARCH"}
        fontWeight={800}
        callback={() => searchConjectures(search)}
      />
      <InputBox
          height={height * 0.15}
          width={width * 0.5}
          x={width * 0.7}
          y={height * 0.05}
          color={white}
          fontSize={width * 0.015}
          fontColor={black}
          text={search}
          fontWeight={300}
          callback={sendSearchPrompt} // Create Popup
      />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.80}
        y={height * 0.93}
        color={red}
        fontSize={width * 0.015}
        fontColor={white}
        text={"BACK"}
        fontWeight={800}
        callback={backCallback}
      />
      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.68}
        y={height * 0.93}
        color={green}
        fontSize={width * 0.014}
        fontColor={white}
        text={"OK"}
        fontWeight={800}
        callback={null}
      />

      <ConjectureSelectorBoxes height={height} width={width} />
      {drawConjectureList(0.15, 0.3, 0.018, width, height, conjectureCallback, backCallback, curricularCallback)}
    </>
  );
};


export default ConjectureSelectModule; 