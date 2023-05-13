const titleInput = document.getElementById('title')
const grabarconfig = document.getElementById('grabar-config')
const leerconfig = document.getElementById('idmotor')

if (grabarconfig) {
    grabarconfig.addEventListener('click', () => {
        // Crear un objeto JSON

        switch ($("#file").val()) {
            case "MotorConfig":
                // Json a grabar
				const Motor = {
					type: $("#file").val(),
					nombre: "config/" + $("#file").val()+"-"+$("#idmotor").val()+ ".json",
					ControlType: $("#ControlType").val(),
					TotalPulses: $("#TotalPulses").val(),
					RateSetting: $("#RateSetting").val(),
					MeterCal: $("#MeterCal").val(),
					ManualAdjust: $("#ManualAdjust").val(),
					KP: $("#KP").val(),
					KI: $("#KI").val(),
					KD: $("#KD").val(),
					MinPWM: $("#MinPWM").val(),
					MaxPWM: $("#MaxPWM").val(),
					Deadband: $("#Deadband").val(),
					BrakePoint: $("#BrakePoint").val(),
					UseMultiPulses: $("#UseMultiPulses").val()
				};
                const jsonData = JSON.stringify(Motor);
                client.publish('/nodo/motor/' + $("#idmotor").val() + '/'+$("#file").val(), jsonData);
                window.electronAPI.grabarConfig(jsonData)
                break;
            case "PidConfig":
                // Json a grabar
                const Pïd = {
                    type: $("#file").val(),
					nombre: "config/" + $("#file").val()+"-"+$("#idmotor").val()+ ".json",
                    pwm_minimo: $("#pwm_minimo").val(),
                    pwm_maximo: $("#pwm_maximo").val(),
                    kp: $("#KP").val(),
                    ki: $("#KI").val(),
                    kd: $("#KD").val(),
                    seccion: $("#seccion").val(),
                    engranaje: $("#engranaje").val()
                };

                 jsonData = JSON.stringify(Parametros);
                client.publish('/nodo/motor/' + $("#idmotor").val() + '/'+$("#file").val(), jsonData);
                window.electronAPI.grabarConfig(jsonData)
                break;
            case "CalConfig":
                const Calibracion = {
                    type: $("#file").val(),
					nombre: "config/" + $("#file").val()+"-"+$("#idmotor").val()+ ".json",
                    pulsos_cal: $("#pulsos_cal").val(),
                    pwm_manual: $("#calibrar_pwm").val(),
                    calibrar_muestra: $("#calibrar_muestra").val(),
                    dosis_pulso: $("#dosis_pulso").val(),
                    ancho_labor: $("#ancho_labor").val()
                };

                const jsonDataCal = JSON.stringify(Calibracion);

                client.publish('/nodo/motor/' + $("#idmotor").val() + '/'+$("#file").val(), jsonDataCal);
                window.electronAPI.grabarConfig(jsonDataCal)
                break;
            default:
                console.log("Sin opcion");
        }

    });
}

if (leerconfig) {
    leerconfig.addEventListener('change', () => {
        if ($("#idmotor").val() != 0) {

            nombre = "config/" + $("#file").val()+"-"+$("#idmotor").val()+ ".json";
            window.electronAPI.leerConfig(nombre);
        }

    });
}