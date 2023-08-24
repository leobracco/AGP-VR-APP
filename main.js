const { app, screen,BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setMenu(null);
  mainWindow.setAlwaysOnTop(true);
  const getBrowserWindowFromEvent = (event) => BrowserWindow.fromWebContents(event.sender);

  ipcMain.on('set-title', (event, title) => {
    getBrowserWindowFromEvent(event).setTitle(title);
  });
  ipcMain.on('ChangeSize', (event, size) => {
    const sizeJSON = JSON.parse(size);
    mainWindow.unmaximize();
    //const display = mainWindow.screen.getPrimaryDisplay();
    //const anchoPantalla = display.workAreaSize.width;
    console.log("Display Size heghtMon"+sizeJSON.heightMon+" widthMon:"+sizeJSON.widthMon+" sizeJSON.height:"+sizeJSON.height);
    // Cambiar el tamaño de la ventana
    mainWindow.setSize(sizeJSON.widthMon, sizeJSON.height);

    // Posicionar la ventana en la parte inferior de la pantalla
    const yPosition = sizeJSON.heightMon - sizeJSON.height;
    console.log("yPosition:"+yPosition);
    mainWindow.setPosition(25, yPosition);
  
   mainWindow.setPosition(0, yPosition);
});
ipcMain.on('maximize-window-request', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  
      window.maximize();
  
});
  ipcMain.on('grabar-config', (event, jsonConfig) => {
    const datosMQTT = JSON.parse(jsonConfig);
    if (datosMQTT.type == "Seeder" && !fs.existsSync(datosMQTT.Directory)) {
      fs.mkdirSync(datosMQTT.Directory);
    }
    fs.writeFile(datosMQTT.nombre, jsonConfig, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('El archivo ha sido guardado:' + datosMQTT.nombre);
    });
  });

  ipcMain.on('ListSeeders', (event, data) => {


    getConfigFromDirectory('./config/Seeders/')
      .then(data => {

        mainWindow.webContents.send('fileList', JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error al procesar los directorios:', error);
      });
  });


  ipcMain.on('loadJsonData', (event, fileName) => {
    if (fs.existsSync(fileName)) {
      fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        mainWindow.webContents.send('jsonDataLoaded', data);
      });
    }
  });

  ipcMain.on('CloneSeeder', async (event, fileName) => {
    const datosMQTT = JSON.parse(fileName);
    const result = await copiarArchivos(datosMQTT.origen, datosMQTT.destino);
    mainWindow.webContents.send('CloneSeederReady', result);
  });
  ipcMain.on('LoadSeeder', async (event, fileName) => {
    const datosMQTT = JSON.parse(fileName);
    copiarParametros(datosMQTT.origen, datosMQTT.destino)
    .then(resultado => {
        console.log('Copiado exitosamente:', resultado);
        mainWindow.webContents.send('LoadSeederReady', resultado);
    })
    .catch(error => {
        console.error('Error:', error.message);
        mainWindow.webContents.send('LoadSeederReady', error.message);
    });
    
    
  });
  // Oyente para el evento move-window
  ipcMain.on('move-window', (event, x, y) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    const currentBounds = currentWindow.getBounds();
    
    // Actualizamos la posición de la ventana basándonos en el desplazamiento recibido
    currentWindow.setBounds({
      x: currentBounds.x + x,
      y: currentBounds.y + y,
      width: currentBounds.width,
      height: currentBounds.height
    });
  });

  mainWindow.loadFile('./public/index.html');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow).then(() => {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

async function copiarParametros(archivoFuente, archivoDestino) {
  console.log('Copiando parametros de:', archivoFuente, 'a:', archivoDestino);
  try {
      // Leer el archivo fuente
      const contenidoFuente = (await fs.promises.readFile(archivoFuente)).toString('utf8');
      const objFuente = JSON.parse(contenidoFuente);

      // Leer el archivo destino
      const contenidoDestino = (await fs.promises.readFile(archivoDestino)).toString('utf8');
      const objDestino = JSON.parse(contenidoDestino);

      // Realizar la operación de copia de parámetros
      for (let key in objFuente) {
          if (key !== "type" && key !== "nombre") {
              let nuevoNombre = key + 'Config';
              if (nuevoNombre in objDestino) {
                  objDestino[nuevoNombre] = objFuente[key];
              }
          }
      }

      // Escribir el objeto resultante en el archivo destino
      await fs.promises.writeFile(archivoDestino, JSON.stringify(objDestino, null, 2), 'utf8');
      
      return 'Datos copiados exitosamente!';
  } catch (error) {
      throw error;
  }
}
async function copiarArchivos(origen, destino) {
  try {
    // Comprueba si el directorio destino existe, si no, lo crea
    try {
      await fs.promises.access(destino);
    } catch (error) {
      await fs.promises.mkdir(destino, { recursive: true });
    }

    // Lee el contenido del directorio origen
    const archivos = await fs.promises.readdir(origen);

    // Filtra el archivo Config.js y copia los demás
    await Promise.all(
      archivos.map(async (archivo) => {
        if (archivo !== 'Config.js') {
          const rutaOrigen = path.join(origen, archivo);
          const rutaDestino = path.join(destino, archivo);

          await fs.promises.copyFile(rutaOrigen, rutaDestino);
        }
      })
    );

    console.log("Copiado exitoso!");
    return "OK";
  } catch (error) {
    console.error("Error al copiar los archivos:", error);
    return error;
  }
}

async function getConfigFromDirectory(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, async (err, folders) => {
      if (err) {
        reject(err);
        return;
      }

      const results = [];

      for (let folder of folders) {
        const folderPath = path.join(directory, folder);
        const configPath = path.join(folderPath, 'Config.json');

        if (fs.existsSync(configPath)) {
          try {
            const rawData = fs.readFileSync(configPath, 'utf-8');
            const jsonData = JSON.parse(rawData);

            if (jsonData.SeederName) {
              results.push({
                folder: folder,
                SeederName: jsonData.SeederName,
                SeederNameNoSpacesConfig: jsonData.SeederNameNoSpaces
              });
            }
          } catch (error) {
            console.error(`Error reading or parsing Config.json in ${folderPath}:`, error);
          }
        }
      }

      resolve(results);
    });
  });
}

app.disableHardwareAcceleration();
