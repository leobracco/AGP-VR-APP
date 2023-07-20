
function hasElapsedOneSecond() {
    let currentTime = Date.now();
    let elapsedTime = currentTime - startTime;

    if (elapsedTime >= 500) { // 1000 ms = 1 segundo
        startTime = currentTime;
        return true;
    } else {
        return false;
    }
}

$("#idmotorParametros").click(function() {
    // Envío del mensaje
    console.log("Prueba");
    const estadoMotor = {
        pwm_manual: $("#pwm_minimo").val(),
        giros_motor: 5
    };

    const mensaje = JSON.stringify(estadoMotor);
    client.publish('/nodo/motor/' + $("#idmotor").val() + '/pwm_minimo', mensaje);
});
$("#autocal").change(function() {
    // Envío del mensaje
    if($("#autocal").val()==1)
    console.log("AUTOCAL TRUE:"+$("#autocal").val())
    else
    console.log("AUTOCAL FALSE:"+$("#autocal").val())
    const estadoMotor = {
        auto: $("#autocal").val()
    };

    const mensaje = JSON.stringify(estadoMotor);
    client.publish('/nodo/motor/' + $("#idmotor").val() + '/parametros/autocal', mensaje);
});
$("#Stop").click(function() {


    // Envío del mensaje
    const estadoMotor = {
        pwm_manual: 0,
        giros_motor: 0
    };

    const mensaje = JSON.stringify(estadoMotor);
    client.publish('/nodo/motor/' + $("#idmotor").val() + '/calibracion/stop', mensaje);
});

$("#calibrar_muestra").change(function() {
    console.log("Dosis en KG:" + $(this).val());
    console.log("Pulsos:" + $("#pulsos_cal").val());
    $("#dosis_pulso").val($(this).val() / $("#pulsos_cal").val())

});


 

// Función para procesar los datos MQTT recibidos y actualizar el gráfico
function actualizarGrafico(mensaje) {
    // Convierte el mensaje JSON recibido en un objeto JavaScript
    var datosMQTT = JSON.parse(mensaje);

    // Agrega los nuevos datos al gráfico
    Plotly.extendTraces(grafico, { x: [[new Date()]], y: [[datosMQTT.SetPoint]] }, [0]);
    Plotly.extendTraces(grafico, { x: [[new Date()]], y: [[datosMQTT.RPM]] }, [1]);
    //Plotly.extendTraces(grafico, { x: [[new Date()]], y: [[datosMQTT.PWM]] }, [2]);
}

