const url = 'ws://192.168.1.17:3000/';
const clientId = 'AGP-VR_' + Math.random().toString(16).substr(2, 8);
const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: clientId
};
nombre = "config/SeederConfig.json";
window.electronAPI.leerConfig(nombre);
var client = mqtt.connect(url, options);
let startTimePu = 0;
let oscillating = false;
let flag = true;

// Iniciar el contador de tiempo
let startTime = Date.now();
let todos

client.on('connect', function () {
  console.log('Connected');
  client.subscribe('/NODO/+/#');
  client.subscribe('/AGP-UDP/#');
  
 

});


client.on('message', function (topic, message) {
  const topico = topic.split('/');
  //console.log("Topico: " + topic)
  const datosMQTT = JSON.parse(message);


  if (topico[2] === "SECCIONES") {
    $("#SpeedLive").html(datosMQTT.speedKmH + " Km/h");
    $("#SpeedLiveHidden").val(datosMQTT.speedKmH);
    for (let i = 0; i <= 64; i++) {
      const seccion = i.toString();

      if (seccion in datosMQTT) {
        const estado = datosMQTT[seccion];
        cambiaEstado("SeccionesLive-" + seccion, estado);
      }
    }
  }
  ///NODO/%d/MOTOR/STATUS"
  if (topico[3] === "MOTOR" && topico[4] === "STATUS") {

    if (topico[2] == $("#Motor-select-Cal").val()) {
      $("#TotalPulses").val(datosMQTT.TotalPulses);
      $("#Turns").val(datosMQTT.TotalPulses / $("#PulsePerRev").val());
     
     


    }
    $("#PWMMotor").html(datosMQTT.PWMMotor+" PWM");
   
    
    $("#RPMLive").html(datosMQTT.RPM.toFixed(2) + " RPM");
    var DosisActual = CalcularDosis($("#SpeedLiveHidden").val(), datosMQTT.RPM);
    $("#DosisLive").html(DosisActual + "/" + datosMQTT.SeedsPerMeter + " Sem/m");

  }



  if (datosMQTT.RPM > 0 && $("#menuActual").val() === "parametros") {
    if ($("#Grafico").is(":visible")) {

      Plotly.extendTraces(grafico, { x: [[new Date()]], y: [[datosMQTT.SetPoint / 600]] }, [0]);
      Plotly.extendTraces(grafico, { x: [[new Date()]], y: [[datosMQTT.RPM]] }, [1]);


    }
  }
});

client.on('error', function (error) {
  console.error('Error:', error);
});
function CalcularDosis(speedKmH, rpm) {
  var SemillasPorMinutoLive = rpm * 20;
  var MetrosEnSegundos = speedKmH / 3.6;
  var MetrosPorMinuto = MetrosEnSegundos * 60;

  var DosisSemillasPorMetro = SemillasPorMinutoLive / MetrosPorMinuto;
  if (isNaN(DosisSemillasPorMetro))
    return 0;
  else
    return DosisSemillasPorMetro.toFixed(2);
}
function hasElapsedOneSecond() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;

  if (elapsedTime >= 500) { // 1000 ms = 1 segundo
    startTime = currentTime;
    return true;
  } else {
    return false;
  }
}

$("#Stop").click(function () {
  const estadoMotor = {
    pwm_manual: 0,
    giros_motor: 0
  };

  const mensaje = JSON.stringify(estadoMotor);
  client.publish('/nodo/motor/' + $("#idmotor").val() + '/calibracion/stop', mensaje);
});

$("#Grabar").click(function () {
  alert("Grabar.");
});

$("#calibrar_muestra").change(function () {
  console.log("Dosis en KG:" + $(this).val());
  console.log("Pulsos:" + $("#pulsos_cal").val());
  $("#dosis_pulso").val($(this).val() / $("#pulsos_cal").val());
});





function BinDataShow(nombrediv, nombrevariable) {
  var surcos = nombrevariable.split("");
  var html = "<table><thead><tr>";

  for (var i = 1; i <= surcos.length; i++) {
    if (surcos[i] === "0")
      html += "<div class='rectangulo-rojo' id=" + nombrediv + "-" + i + " onclick=OnOffSection('" + nombrediv + "-" + i + "') estado=" + surcos[i] + "></div><div class='spacer'></div>";
    else
      html += "<div class='rectangulo-verde' id=" + nombrediv + "-" + i + " onclick=OnOffSection('" + nombrediv + "-" + i + "') estado=" + surcos[i] + "></div><div class='spacer'></div>";
  }

  html += "</tr></thead></table>";
  $("#" + nombrediv).html(html);
}

function OnOffSection(id) {
  alert("Estado: " + ($("#" + id).attr("estado") === "1" ? "Activo" : "Inactivo"));
}

function cambiaEstado(nombrediv, estado) {
  if (estado === 1) {
    $('#' + nombrediv).removeClass('rectangulo-rojo').addClass('rectangulo-verde');
    $("#" + nombrediv).attr("estado", "1");
  } else {
    $('#' + nombrediv).removeClass('rectangulo-verde').addClass('rectangulo-rojo');
    $("#" + nombrediv).attr("estado", "0");
  }
}


