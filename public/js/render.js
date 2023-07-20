const titleInput = document.getElementById('title')
const grabarconfig = document.getElementById('grabar-config')
const leerconfig = document.getElementById('Motor-select')



if (grabarconfig) {
    grabarconfig.addEventListener('click', () => {
        // Crear un objeto JSON

        switch ($("#file").val()) {
            case "ParametrosMotor":
                // Json a grabar
				const Motor = {
					type: $("#file").val(),
					MinPWM: $("#MinPWM").val(),
					MaxPWM: $("#MaxPWM").val(),
                    DirPin: $("#DirPin").val(),
                    PWMPin: $("#PWMPin").val(),
				};
                const jsonData = JSON.stringify(Motor);
                client.publish('/nodo/motor/' + $("#Motor-select").val() + '/'+$("#file").val(), jsonData);
                window.electronAPI.grabarConfig(jsonData)
                break;
            case "PidConfig":
                // Json a grabar
                const Pïd = {
                    type: $("#file").val(),
					nombre: "config/" + $("#file").val()+"-"+$("#Motor-select").val()+ ".json",
                    KP: $("#KP").val(),
                    KI: $("#KI").val(),
                    KD: $("#KD").val(),
                    FlowOnDirection: $("#FlowOnDirection").val(),
                    FlowPin: $("#FlowPin").val(),
                    
                };
                    ///AGP-APP/NODO/%d/PIDCONFIG
                 jsonData = JSON.stringify(Parametros);
                client.publish('/AGP-APP/NODO/' + $("#Motor-select").val() + '/'+$("#file").val(), jsonData);
                window.electronAPI.grabarConfig(jsonData)
                break;
            case "CalConfig":
                const Calibracion = {
                    type: $("#file").val(),
					nombre: "config/" + $("#file").val()+"-"+$("#Motor-select").val()+ ".json",
                    RateSetting: $("#RateSetting").val(),
                    TotalPulses: $("#TotalPulses").val(),
                    MeterCal: $("#MeterCal").val(),
                    ManualAdjust: $("#ManualAdjust").val(),
                    UPM: $("#UPM").val(),
                    Working_Width: $("#Working_Width").val()
                };

                const jsonDataCal = JSON.stringify(Calibracion);

                client.publish('/nodo/motor/' + $("#Motor-select").val() + '/'+$("#file").val(), jsonDataCal);
                window.electronAPI.grabarConfig(jsonDataCal)
                break;
            default:
                console.log("Sin opcion");
        }

    });
}

if (leerconfig) {
    console.log("Leer Config");
    leerconfig.addEventListener('change', () => {
        if ($("#Motor-select").val() != 0) {

            nombre = "config/" + $("#file").val()+"-"+$("#Motor-select").val()+ ".json";
            window.electronAPI.leerConfig(nombre);
        }

    });
}
$('#Motor-select').change(function() {
    // Acciones a realizar cuando se detecte el cambio
    console.log('Se detectó un cambio en el input');
  });