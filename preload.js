const {
  contextBridge,
  ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  grabarConfig: (json) => ipcRenderer.send('grabar-config', json),
  leerConfig: (file) => ipcRenderer.send('loadJsonData', file)
})


function leerConfigLoad(callback) {
  ipcRenderer.on('jsonDataLoaded', (event, jsonData) => {
      
      callback(jsonData);
  });
}


leerConfigLoad((jsonData,idmotor,fileName) => {

  var datosMQTT = JSON.parse(jsonData);
  
  console.log("datosMQTT:"+datosMQTT);
 // console.log("fileName:"+fileName);

  switch (datosMQTT.type) {
      case "MotorConfig":
          // Json a grabar
          console.log("Entra en MotorConfig");
          //console.log(datosMQTT.KP);
          actualizarValor('ControlType', 'ControlType', datosMQTT);
          actualizarValor('TotalPulses', 'TotalPulses', datosMQTT);
          actualizarValor('RateSetting', 'RateSetting', datosMQTT);
          actualizarValor('MeterCal', 'MeterCal', datosMQTT);
          actualizarValor('ManualAdjust', 'ManualAdjust', datosMQTT);
          actualizarValor('KP', 'KP', datosMQTT);
          actualizarValor('KI', 'KI', datosMQTT);
          actualizarValor('KD', 'KI', datosMQTT);
          actualizarValor('MinPWM', 'MinPWM', datosMQTT);
          actualizarValor('MaxPWM', 'MaxPWM', datosMQTT);
          actualizarValor('Deadband', 'Deadband', datosMQTT);
          actualizarValor('BrakePoint', 'BrakePoint', datosMQTT);
          actualizarValor('UseMultiPulses', 'UseMultiPulses', datosMQTT);



          break;
      case "CalConfig":
        
          actualizarValor('pulsos_cal', 'pulsos_cal', datosMQTT);
          actualizarValor('calibrar_muestra', 'calibrar_muestra', datosMQTT);
          actualizarValor('dosis_pulso', 'dosis_pulso', datosMQTT);
          actualizarValor('ancho_labor', 'ancho_labor', datosMQTT);
         
          
          break;
      case "Pidonfig":
          actualizarValor('ancho_labor', 'ancho_labor', datosMQTT);  
          break;
      default:
          console.log("Sin opcion");
  }
});

function actualizarValor(idElemento, propiedad, datos) {
  const input = document.getElementById(idElemento);
  console.log( datos[propiedad])
  input.value = datos[propiedad];
}