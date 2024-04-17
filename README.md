# Hidden Village Project

## Getting started
First, we need to clone the repository (`git clone git@github.com:T0rt13/hidden_village_v0.5.git`). We recommend you clone using SSH. If you don't have SSH configured to work with github, you can follow [these instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

## WINDOWS INSTRUCTIONS
Please install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) before proceeding. (Sometimes this is not needed)

## Create a development build of the app

There are few prerequisite pieces of software you will need to get started:
 - [installation of NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
 - [installation of node](https://github.com/nvm-sh/nvm#usage)



After you installed yarn, you `change directory` or `cd` into the hidden_village directory (if you're not already there) and run:

You'll be able to run files and commands using node's npm command.
```
npm install
```

Npm package handler will install all the dependencies for the project in order to proceed. Downloaded packages from package.json will appear under node_modules. packageLock.json is the 'lock' file which ensures that all package/dependency versions are locked to the same version which ensures everyone is on the same version.

You can add new packages/dependencies to thew package.json file so that they do not need to be installed everytime you open up a new repository of THV.

### Run a dev server
To serve the app locally, run `npm run dev`, you can then visit any of these URLs which influence the behavior of the THV app:  
 [localhost:1234](#localhost:1234)  
 ```
 This is the default local app URL. Recording of conjecture data will not happen, and the framerate (FPS) will be set to the default (which is normally 30)
 
 ```

These currently do not work with the new format of playing the game.

 [http://localhost:1234/?recording=true](#http://localhost:1234/?recording=true)
 ```
 This will record conjecture data to firebase at the default FPS (usually 30)
 ```
 [http://localhost:1234/?recording=true&fps=30](#http://localhost:1234/?recording=true&fps=30)
 ```
 Changing the 30 (17, for example) to any positive integer will change FPS that data is sent to Firebase.
 ```

 
 
