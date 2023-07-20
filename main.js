const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');

const filePath = './configMotor1.json';
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setMenu(null)

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
    console.log("main")
  })

  ipcMain.on('grabar-config', (event, jsonConfig) => {


    const webContents = event.sender
    var datosMQTT = JSON.parse(jsonConfig);

    const win = BrowserWindow.fromWebContents(webContents)
    fs.writeFile(datosMQTT.nombre, jsonConfig, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('El archivo ha sido guardado:'+datosMQTT.nombre);
    });
    console.log(jsonConfig)
  })
  ipcMain.on('ListSeeders', (event) => {
    const directoryPath = './config/Seeders/';
  
    // Lee el directorio y obtiene la lista de archivos
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error al leer el directorio:', err);
        return;
      }
  
      var Seeders = [];
     
      files.forEach(function forFile(file) {
        var Seeder = { Name: path.basename(file, '.json') }; // Obtener el nombre sin la extensión .json
  
        Seeders.push(Seeder);
      });
  
      // Envía la lista de archivos JSON a la ventana
      mainWindow.webContents.send('fileList', JSON.stringify(Seeders));
    });
  });
  
  ipcMain.on('loadJsonData', (event, fileName) => {
    console.log("Entra a leer:" + fileName)

    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("datos:" + data)
      mainWindow.webContents.send('jsonDataLoaded', data);
    });
  });
  mainWindow.loadFile('./public/index.html')
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.disableHardwareAcceleration();

