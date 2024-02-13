import Background from "./Background";
import Button from "./Button";
import { Text } from "@inlet/react-pixi";
import { TextStyle } from "@pixi/text";
import { yellow, blue, green, white, red } from "../utils/colors";

import React, { useState, useEffect } from 'react';
import {writeToDatabaseNewUser, getUserRoleFromDatabase, getUserNameFromDatabase} from "../firebase/userDatabase";
import UserManagementModule from '../components/AdminHomeModule/UserManagementModule';


const Home = (props) => {
  const { height, width, startCallback, editCallback, conjectureCallback, logoutCallback, testCallback, curricularCallback,UserManagementCallback } = props;
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        console.log('Fetching user name...');
        const name = await getUserNameFromDatabase();
        console.log('Fetched user name:', name);
  
        if (name !== null && name !== "USER NOT FOUND") {
          setUserName(name);
          console.log('User found. Set user name.');
        } else if (name === "USER NOT FOUND") {
          console.log('User not found. Stop trying.');
        } else {
          console.log('User name is null. Retrying...');
          fetchData();  // Retry the fetch
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);




  return (
    <>
      <Background height={height} width={width} />
      <Button
        height={height * 0.5}
        width={width * 0.33}
        x={width * 0.5}
        y={height * 0.7}
        color={blue}
        fontSize={120}
        fontColor={yellow}
        text={"Start"}
        fontWeight={800}
        callback={startCallback}
      />
      <Button
        height={height * 0.205}
        width={width * 0.105}
        x={width * 0.15}
        y={height * 0.75}
        color={green}
        fontSize={18}
        fontColor={white}
        text={"Test"}
        fontWeight={800}
        callback={testCallback}
      />
      <Button
        height={height * 0.205}
        width={width * 0.105}
        x={width * 0.85}
        y={height * 0.105}
        color={red}
        fontSize={18}
        fontColor={white}
        text={"Conjecture Editor"}
        fontWeight={800}
        callback={conjectureCallback}
      />
      <Button
        height={height * 0.2}
        width={width * 0.1}
        x={width * 0.15}
        y={height * 0.1}
        color={red}
        fontSize={24}
        fontColor={white}
        text={"Log Out"}
        fontWeight={800}
        callback={logoutCallback}
      />
      <Button
        height={height * 0.2}
        width={width * 0.1}
        x={width *0.85}
        y={height *0.9}
        color={red}
        fontSize={24}
        fontColor={white}
        text={"Curricular Content Editor"}
        fontWeight={800}
        callback={curricularCallback}
      />
      <Text
        text={"Hidden Village"}
        x={width * 0.5}
        y={height * 0.25}
        style={
          new TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: 146,
            fontWeight: 800,
            fill: [blue],
            letterSpacing: -5,
          })
        }
        anchor={0.5}
      />
      <Text
        text={`Playing as: ${userName}`}
        x={width * 0.5}
        y={height * 0.05}
        style={
          new TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: 20,
            fontWeight: 800,
            fill: [blue],
            letterSpacing: 0,
          })
        }
        anchor={0.5}
      />
      <Button
        height={height * 0.2}
        width={width * 0.1}
        x={width *0.5}
        y={height *0.09}
        color={red}
        fontSize={10}
        fontColor={white}
        text={"Admin Create User Module"}
        fontWeight={800}
        callback={UserManagementCallback}
      />

    </>
  );
};

export default Home;
