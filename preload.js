
const {
  contextBridge,
  ipcRenderer
} = require('electron');

// Exponer funciones al proceso de renderizado
contextBridge.exposeInMainWorld(
  'electronAPI', {
    moveWindow: (x, y) => {
      ipcRenderer.send('move-window', x, y);
    },
    setTitle: title => {
      ipcRenderer.send('set-title', title);
    },
    grabarConfig: json => {
      ipcRenderer.send('grabar-config', json);
    },
    leerConfig: file => {
      ipcRenderer.send('loadJsonData', file);
    },
    readListSeeders: () => {
      ipcRenderer.send('ListSeeders');
    },
    cloneSeeder: json => {
      ipcRenderer.send('CloneSeeder', json);
    },
    loadSeeder: json => {
      ipcRenderer.send('LoadSeeder', json);
    },
    changeSize: json => {
      ipcRenderer.send('ChangeSize', json);
    },
    maximizeWindow: () => {
      ipcRenderer.send('maximize-window-request');
    }
  }
);

// Escucha y maneja datos para Seeders
ipcRenderer.on('fileList', (event, jsonData) => {
  const select = document.getElementById("SeederNameList");
  const seeders = JSON.parse(jsonData);

  select.innerHTML = ''; // Limpia el select

  for (let seeder of seeders) {
    const opt = document.createElement('option');
    opt.value = seeder.SeederNameNoSpacesConfig;
    opt.textContent = seeder.SeederName;
    if (seeder.SeederNameNoSpacesConfig === getValue("SeederNameNoSpacesConfig")) {
      opt.selected = true;
    }
    select.append(opt);
  }
});

// Escucha y maneja la configuración cargada
ipcRenderer.on('jsonDataLoaded', (event, jsonData) => {
  const datosMQTT = JSON.parse(jsonData);

  const mappings = {
    ParametrosMotor: ['DirPin', 'PWMPin', 'MinPWM', 'MaxPWM'],
    CalConfig: ['Auto', 'ManualPWM', 'MinimumDose', 'Working_Width', 'PulsePerRev', 'HolesPerPlate', 'DosePerUnit', 'SeedsPerMeter', 'SeedsPerHectare', 'KilosPerHectare', 'LitersPerHectare', 'DosePer'],
    PidConfig: ['KP', 'KI', 'KD', 'FlowPin', 'Deadband'],
    Seeder: ['SeederName', 'Working_Width', 'Rows', 'RowSpacing', 'SeederNamePrev'],
    SeederConfig: ['SeederNameConfig', 'Working_WidthConfig', 'RowsConfig', 'RowSpacingConfig', 'SeederNameNoSpacesConfig']
  };

  const props = mappings[datosMQTT.type];
  if (props) {
    props.forEach(prop => actualizarValor(prop, prop, datosMQTT));
  } else {
    console.log("Sin opción");
  }
});

function actualizarValor(idElemento, propiedad, datos) {
  const input = document.getElementById(idElemento);
  if (input) {
    input.value = datos[propiedad];
  }
}

function getValue(elementId) {
  const element = document.getElementById(elementId);
  return element ? element.value : null;
}
