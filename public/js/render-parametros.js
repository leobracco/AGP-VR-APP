
$("#Motor-select-Param").on("change", function () {
    if ($("#Motor-select-Param").val() != 0) {

        nombre = "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/ParametrosMotor-" + $("#Motor-select-Param").val() + ".json";
        window.electronAPI.leerConfig(nombre);
        nombre = "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/PidConfig-" + $("#Motor-select-Param").val() + ".json";
        window.electronAPI.leerConfig(nombre);
        $("#ParametrosMotor").prop("disabled", false);
        $("#ClonarParametrosMotor").prop("disabled", false);
    }
});


var grafico;

$(document).ready(function () {

    for (var i = 1; i <= $("#RowsConfig").val(); i++)
        $("#Motor-select-Param").append(new Option("Motor " + i, i));
    $("#Calibracion").hide();
    $("#Motor").show();
    $("#Grafico").hide();
    grafico = document.getElementById('grafico');
    $("#ParametrosMotor").prop("disabled", true);
    $("#ClonarParametrosMotor").prop("disabled", true);
    // Define los datos iniciales para el gráfico
    var datos = [{
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines',
        name: 'Setpoint'
    }, {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines',
        name: 'Input'
    }];

    // Define las opciones para el gráfico
    var opciones = {
        margin: { t: 0 },
        legend: { orientation: 'h' }
    };

    // Crea el gráfico utilizando Plotly.js
    Plotly.newPlot(grafico, datos, opciones);
    if (sessionStorage.getItem('Page') != "home")

        $('#changeSize').css('display', 'none');



});
$('#Calibracion-tab').click(function () {
    // Acciones a realizar cuando se detecte el cambio

    $(this).addClass("active");
    $("#Grafico-tab").removeClass("active");
    $("#Motor-tab").removeClass("active");
    $("#Grafico").hide();
    $("#Motor").hide();
    $("#Calibracion").show();
    console.log('Se detectó un cambio en el input');
});
$('#Grafico-tab').click(function () {
    // Acciones a realizar cuando se detecte el cambio

    $(this).addClass("active");


    $("#Calibracion-tab").removeClass("active");
    $("#Motor-tab").removeClass("active");
    $("#Calibracion").hide();
    $("#Motor").hide();
    $("#Grafico").show();
    console.log('Se detectó un cambio en el input');
    // Selecciona el contenedor HTML para el gráfico

});
$('#Motor-tab').click(function () {
    // Acciones a realizar cuando se detecte el cambio

    $(this).addClass("active");
    $("#Grafico-tab").removeClass("active");
    $("#Calibracion-tab").removeClass("active");
    $("#Calibracion").hide();
    $("#Grafico").hide();
    $("#Motor").show();
    console.log('Se detectó un cambio en el input');
});
$("#ParametrosMotor").on("click", function () {
    alert("ParametrosMotor" + $(this).attr("tab"));

    const Motor = {
        type: $(this).attr("tab"),
        nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/ParametrosMotor-" + $("#Motor-select-Param").val() + ".json",
        MinPWM: $("#MinPWM").val(),
        MaxPWM: $("#MaxPWM").val(),
        DirPin: $("#DirPin").val(),
        PWMPin: $("#PWMPin").val(),
    };

    const jsonData = JSON.stringify(Motor);

    client.publish('/NODO/MOTOR/' + $("#Motor-select-Param").val() + '/MOTOR', jsonData);
    window.electronAPI.grabarConfig(jsonData)



});
$("#ClonarParametrosMotor").on("click", function () {

    for (var i = 1; i <= $("#RowsConfig").val(); i++) {
        if ($("#Motor-select-Param").val() != i) {
            const Motor = {
                type: "ParametrosMotor",
                nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/ParametrosMotor-" + i + ".json",
                MinPWM: $("#MinPWM").val(),
                MaxPWM: $("#MaxPWM").val(),
                DirPin: $("#DirPin").val(),
                PWMPin: $("#PWMPin").val(),
            };

            const jsonData = JSON.stringify(Motor);

            client.publish('/NODO/MOTOR/' + i + '/MOTOR', jsonData);
            window.electronAPI.grabarConfig(jsonData)
        }
    }


});

$("#PidConfig").on("click", function () {
    console.log("PidConfig:" + $(this).attr("tab"));

    // Json a grabar
    const Pid = {
        type: $(this).attr("tab"),
        nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/PidConfig-" + $("#Motor-select-Param").val() + ".json",
        KP: $("#KP").val(),
        KI: $("#KI").val(),
        KD: $("#KD").val(),
        Deadband: $("#Deadband").val(),
        FlowOnDirection: $("#FlowOnDirection").val(),
        FlowPin: $("#FlowPin").val()
    };

    jsonData = JSON.stringify(Pid);
    console.log('/NODO/MOTOR/' + $("#Motor-select-Param").val() + '/' + $(this).attr("tab"))
    console.log(jsonData)
    console.log(client)
    client.publish('/NODO/MOTOR/' + $("#Motor-select-Param").val() + '/' + $(this).attr("tab"), jsonData);
    window.electronAPI.grabarConfig(jsonData)


});
$("#ClonarPidConfig").on("click", function () {
    // console.log("PidConfig:" + $(this).attr("tab"));

    for (var i = 1; i <= $("#RowsConfig").val(); i++) {
        if ($("#Motor-select-Param").val() != i) {
            const Pid = {
                type: "PidConfig",
                nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/PidConfig-" + i + ".json",
                KP: $("#KP").val(),
                KI: $("#KI").val(),
                KD: $("#KD").val(),
                Deadband: $("#Deadband").val(),
                FlowOnDirection: $("#FlowOnDirection").val(),
                FlowPin: $("#FlowPin").val()
            };

            jsonData = JSON.stringify(Pid);
            console.log('/NODO/MOTOR/' + i + '/' + PidConfig)
            console.log(jsonData)
            console.log(client)
            client.publish('/NODO/MOTOR/' + i + '/' + PidConfig, jsonData);
            window.electronAPI.grabarConfig(jsonData)
        }
    }



});
