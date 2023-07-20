const {
  contextBridge,
  ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  grabarConfig: (json) => ipcRenderer.send('grabar-config', json),
  leerConfig: (file) => ipcRenderer.send('loadJsonData', file),
  readListSeeders: (json) => ipcRenderer.send('ListSeeders', json)
})

function readListSeeders(callback) {
  ipcRenderer.on('fileList', (event, jsonData) => {

    callback(jsonData);
  });
}

function leerConfigLoad(callback) {
  ipcRenderer.on('jsonDataLoaded', (event, jsonData) => {

    callback(jsonData);
  });
}
readListSeeders((jsonData) => {

  //var select = $('<select name="SeederName" id="SeederName" class="form-control form-control-user" multiple></select>');
  var select = document.getElementById("SeederName");

  var seeders = JSON.parse(jsonData);


  for (let x in seeders) {


    var opt = document.createElement('option');
    opt.value = seeders[x].Name;
    opt.innerHTML = seeders[x].Name;
    select.append(opt);
  }

}
);







// Agrega el elemento select al contenedor
//$('#selectContainer').append(select);




leerConfigLoad((jsonData, idmotor, fileName) => {

  var datosMQTT = JSON.parse(jsonData);

  switch (datosMQTT.type) {
    case "ParametrosMotor":
      actualizarValor('DirPin', 'DirPin', datosMQTT);
      actualizarValor('PWMPin', 'PWMPin', datosMQTT);
      actualizarValor('MinPWM', 'MinPWM', datosMQTT);
      actualizarValor('MaxPWM', 'MaxPWM', datosMQTT);
      break;
    case "CalConfig":
      actualizarValor('Auto', 'Auto', datosMQTT);
      actualizarValor('ManualPWM', 'ManualPWM', datosMQTT);

      actualizarValor('MinimumDose', 'MinimumDose', datosMQTT);
      actualizarValor('Working_Width', 'Working_Width', datosMQTT);
      actualizarValor('PulsePerRev', 'PulsePerRev', datosMQTT);
      actualizarValor('HolesPerPlate', 'HolesPerPlate', datosMQTT);
      actualizarValor('DosePerUnit', 'DosePerUnit', datosMQTT);
      actualizarValor('SeedsPerMeter', 'SeedsPerMeter', datosMQTT);
      actualizarValor('SeedsPerHectare', 'SeedsPerHectare', datosMQTT);
      actualizarValor('KilosPerHectare', 'KilosPerHectare', datosMQTT);
      actualizarValor('LitersPerHectare', 'LitersPerHectare', datosMQTT);
      actualizarValor('DosePer', 'DosePer', datosMQTT);

      break;

    case "PidConfig":
      actualizarValor('KP', 'KP', datosMQTT);
      actualizarValor('KI', 'KI', datosMQTT);
      actualizarValor('KD', 'KD', datosMQTT);
      actualizarValor('FlowPin', 'FlowPin', datosMQTT);
      break;
    case "Seeder":
      actualizarValor('SeederName', 'SeederName', datosMQTT);
      actualizarValor('Working_Width', 'Working_Width', datosMQTT);
      actualizarValor('Rows', 'Rows', datosMQTT);
      actualizarValor('RowSpacing', 'RowSpacing', datosMQTT);
      actualizarValor('SeederNamePrev', 'SeederName', datosMQTT);
      
      break;


    case "SeederConfig":


      actualizarValor('SeederNameConfig', 'SeederName', datosMQTT);
      actualizarValor('Working_WidthConfig', 'Working_Width', datosMQTT);
      actualizarValor('RowsConfig', 'Rows', datosMQTT);
      actualizarValor('RowSpacingConfig', 'RowSpacing', datosMQTT);

      break;
    default:
      console.log("Sin opcion");
  }
});

function actualizarValor(idElemento, propiedad, datos) {
  const input = document.getElementById(idElemento);
  input.value = datos[propiedad];
  return true;

}
