const url = 'ws://192.168.1.17:3000/';
const clientId = 'AGP-VR_' + Math.random().toString(16).substr(2, 8);
const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: clientId
};
nombre = "config/SeederConfig.json";
window.electronAPI.leerConfig(nombre);
//const currentWindow = window.getCurrentWindow();


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
        if (sessionStorage.getItem('Page')=="home")
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
    $("#PWMMotor").html(datosMQTT.PWMMotor + " PWM");


    $("#RPMLive").html(datosMQTT.RPM.toFixed(2) + " RPM");
    var DosisActual = CalcularDosis($("#SpeedLiveHidden").val(), datosMQTT.RPM);
    $("#DosisLive").html(DosisActual + "/" + datosMQTT.SeedsPerMeter + " Sem/m");
    // var DosisActual = CalcularDosis(datosMQTT.speedKmH, datosMQTT.RPM);
    //console.log("Dosis Actual:" + DosisActual)
    $("#SeccionesLive-" + datosMQTT.IdSection).html(DosisActual);
    if (sessionStorage.getItem('Page')=="home")
    cambiarColores(DosisActual, parseInt(datosMQTT.SeedsPerMeter) ,datosMQTT.IdSection)
  }



  if (datosMQTT.RPM > 0 && $("#menuActual").val() === "parametros") {
    if ($("#Grafico").is(":visible")) {

      Plotly.extendTraces(grafico, {
        x: [
          [new Date()]
        ],
        y: [
          [datosMQTT.SetPoint / 600]
        ]
      }, [0]);
      Plotly.extendTraces(grafico, {
        x: [
          [new Date()]
        ],
        y: [
          [datosMQTT.RPM]
        ]
      }, [1]);


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




let surcos;

function BinDataShow(nombrediv, nombrevariable) {
  let width = $('#SeccionesLive').width();
  console.log("Tamanio:" + width);

  surcos = nombrevariable.split("");
  var html = "<table><thead><tr>";

  for (var i = 1; i <= surcos.length; i++) {
    if (surcos[i] === "0")
      html += "<div class='tubo-rojo' id=" + nombrediv + "-" + i + " onclick=OnOffSection('" + nombrediv + "-" + i + "') estado=" + surcos[i] + "></div><div class='spacer'></div>";
    else
      html += "<div class='tubo-verde' id=" + nombrediv + "-" + i + " onclick=OnOffSection('" + nombrediv + "-" + i + "') estado=" + surcos[i] + "></div><div class='spacer'></div>";
  }

  html += "</tr></thead></table>";
  $("#" + nombrediv).html(html);
  $(".tubo-rojo").css("width", width / surcos.length - 1 + 'px');
  $(".tubo-verde").css("width", width / surcos.length - 1 + 'px');



}

function StatusLive(nombrediv, nombrevariable) {
  let width = $('#SeccionesLive').width();
  console.log("Tamanio:" + width);

  surcos = nombrevariable.split("");
  var html = "<table><thead><tr>";

  for (var i = 1; i <= surcos.length; i++) {

    html += "<div class='tubo-status' id='Status-" + nombrediv + "-" + i + "' >3/4</div><div class='spacer'></div>";
  }

  html += "</tr></thead></table>";
  $("#" + nombrediv).html(html);
  $(".tubo-status").css("width", width / surcos.length - 1 + 'px');
}

function OnOffSection(id) {
  alert("Estado: " + ($("#" + id).attr("estado") === "1" ? "Activo" : "Inactivo"));
}

function cambiaEstado(nombrediv, estado) {
  if (estado === 1) {
    $('#' + nombrediv).removeClass('tubo-rojo').addClass('tubo-verde');
    $("#" + nombrediv).attr("estado", "1");
  } else {
    $('#' + nombrediv).removeClass('tubo-verde').addClass('tubo-rojo');
    $("#" + nombrediv).attr("estado", "0");
  }
  let width = $('#SeccionesLive').width();
  $(".tubo-rojo").css("width", width / surcos.length - 1 + 'px');
  $(".tubo-verde").css("width", width / surcos.length - 1 + 'px');
  let fontSize = mapRange(width / surcos.length, width / 64, width, 10, 20); // Ajusta este valor según tus necesidades
  $(".tubo-verde").css('font-size', fontSize + "px");
  $(".tubo-rojo").css('font-size', fontSize + "px");
}

function mapRange(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function calcularPorcentaje(parte, total) {
  //console.log("Dato:"+total+" Porcentaje:"+parte)
  return parte * total / 100;
}
function cambiarColores(valor,dateReal,seccion) {
  console.log("Calculo:"+calcularPorcentaje(81,dateReal)+" DateReal:"+dateReal);
  let maxValue=dateReal*2;
  let vumeterDiv = $('#SeccionesLive-1');
  let percentage = valor / 150;
  let blue = mapRange(valor, calcularPorcentaje(121,dateReal), calcularPorcentaje(200,dateReal), 0, 100);
  let orange = mapRange(valor, calcularPorcentaje(101,dateReal), calcularPorcentaje(120,dateReal), 0, 100);
  let green = mapRange(valor, calcularPorcentaje(80,dateReal), calcularPorcentaje(100,dateReal), 0, 100);
  let red = mapRange(valor, calcularPorcentaje(60,dateReal), calcularPorcentaje(79,dateReal), 0, 100);
  let black = mapRange(valor, calcularPorcentaje(0,dateReal), calcularPorcentaje(59,dateReal), 0, 100);
  let gradient = `linear-gradient(to bottom,
                                    blue ${blue}%, 
                                    orange ${orange}%, 
                                    green ${green}%, 
                                    red ${red}%,
                                    black ${black}%)`;
  document.getElementById("SeccionesLive-"+seccion).style.backgroundImage = gradient;
}
function actualizarVelocimetro(nuevaVelocidad) {
  console.log("Velocidad:"+nuevaVelocidad)
  let grados = (nuevaVelocidad / 100) * 180; // Asume que la velocidad máxima es 100
  $('.aguja').css('transform', `rotate(${grados}deg)`);
  $('.valor-velocidad').text(nuevaVelocidad);
}
$(document).ready(function() {
  let isDragging = false;
  let startX, startY;

  function startHandler(e) {
    if (e.touches) {
        e.preventDefault();  // Para prevenir el comportamiento estándar del navegador en eventos táctiles.
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else {
        startX = e.clientX;
        startY = e.clientY;
    }
    isDragging = true;
}

function moveHandler(e) {
    if (!isDragging) return;

    let currentX, currentY;
    if (e.touches) {
        e.preventDefault();  // Nuevamente, para prevenir el comportamiento por defecto.
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    } else {
        currentX = e.clientX;
        currentY = e.clientY;
    }

    const x = currentX - startX;
    const y = currentY - startY;

    window.electronAPI.moveWindow(x, y);

    startX = currentX;
    startY = currentY;
}
  function endHandler() {
      isDragging = false;
  }

  // Eventos de mouse.
  $(document).on('mousedown', startHandler);
  $(document).on('mousemove', moveHandler);
  $(document).on('mouseup', endHandler);

  // Eventos táctiles.
  $(document).on('touchstart', startHandler);
  $(document).on('touchmove', moveHandler);
  $(document).on('touchend', endHandler);
});
