const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
// const express = require('express');

require('electron-reload')(__dirname);

let window

var userLoggedIn = false

// app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));

if(!userLoggedIn){
  function createWindow () {
    window = new BrowserWindow({
      width: 600, 
      height: 550,
      frame: false,
    })

    window.setMenu(null)

    window.loadURL(url.format({
      pathname: path.join(__dirname, 'src/login.html'),
      protocol: 'file:',
      slashes: true
    }))

    window.webContents.openDevTools()
    
  }
}
else{
  function createWindow () {
    window = new BrowserWindow({width: 800, height: 600})
    window.setMenu(null)
  
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'src\index.html'),
      protocol: 'file:',
      slashes: true
    }))
    
    // win.webContents.openDevTools()
  }
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (window === null) {
    createWindow()
  }
})
