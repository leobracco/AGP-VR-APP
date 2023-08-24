$("#Motor-select-Cal").on("change", function () {
    if ($("#Motor-select-Cal").val() != 0) {

        nombre = "config/CalConfig-" + $("#Motor-select-Cal").val() + ".json";
        window.electronAPI.leerConfig(nombre);

    }
});




$(document).ready(function () {
    // Obtener el elemento select

    //var s = $("<select id=\"Motor-select-Cal\" name=\"selectName\" />");
    for (var i = 1; i <= $("#RowsConfig").val(); i++) {
        $("#Motor-select-Cal").append(new Option("Motor " + i, i));
    }


    $("#TipoDeDosis").hide();
    $("#Cuerpo").show();
    $("#CalDeDosis").hide();
    if (sessionStorage.getItem('Page') != "home")

    $('#changeSize').css('display', 'none');
});
$('#TipoDeDosis-tab').click(function () {


    $(this).addClass("active");
    $("#CalDeDosis-tab").removeClass("active");
    $("#Cuerpo-tab").removeClass("active");
    $("#CalDeDosis").hide();
    $("#Cuerpo").hide();
    $("#TipoDeDosis").show();
    console.log('Se detectó un cambio en el input');
});
$('#CalDeDosis-tab').click(function () {


    $(this).addClass("active");


    $("#TipoDeDosis-tab").removeClass("active");
    $("#Cuerpo-tab").removeClass("active");
    $("#TipoDeDosis").hide();
    $("#Cuerpo").hide();
    $("#CalDeDosis").show();

    if ($("#DosePer").val() == "SeedsPerMeter") {
        $("#MinimumDose").attr("placeholder", "Semillas por metro");
        $("#MinimumDoseText").html("Dosis Minima en Semillas por metro");
        $("#MinimumDoseText").html("Dosis Minima en Semillas por metro");
        $("#Sample").html("Semillas");

    }

    if ($("#DosePer").val() == "SeedsPerHectare") {
        $("#MinimumDose").attr("placeholder", "Semillas por hectarea");
        $("#MinimumDoseText").html("Dosis Minima en Semillas por hectarea");
        $("#Sample").html("Semillas");
    }
    if ($("#DosePer").val() == "KilosPerHectare") {
        $("#MinimumDose").attr("placeholder", "Kilos por hectarea");
        $("#MinimumDoseText").html("Dosis Minima en Kilos por hectarea");
        $("#Sample").html("Kg");
    }
    if ($("#DosePer").val() == "LitersPerHectare") {
        $("#MinimumDose").attr("placeholder", "Litros por hectarea");
        $("#MinimumDoseText").html("Dosis Minima en Litros por hectarea");
        $("#Sample").html("Litros");
    }
});
$('#Cuerpo-tab').click(function () {


    $(this).addClass("active");
    $("#CalDeDosis-tab").removeClass("active");
    $("#TipoDeDosis-tab").removeClass("active");
    $("#TipoDeDosis").hide();
    $("#CalDeDosis").hide();
    $("#Cuerpo").show();

});
$("#ParametrosMotor").on("click", function () {
    alert("ParametrosMotor" + $(this).attr("tab"));

    const Motor = {
        type: $(this).attr("tab"),
        nombre: "config/" + $(this).attr("tab") + "-" + $("#Motor-select-Cal").val() + ".json",
        MinPWM: $("#MinPWM").val(),
        MaxPWM: $("#MaxPWM").val(),
        DirPin: $("#DirPin").val(),
        PWMPin: $("#PWMPin").val(),
    };
    const jsonData = JSON.stringify(Motor);

    client.publish('/AGP-APP/NODO/' + $("#Motor-select-Cal").val() + '/' + $(this).attr("tab"), jsonData);
    window.electronAPI.grabarConfig(jsonData)



});


$("#PidConfig").on("click", function () {
    console.log("PidConfig:" + $(this).attr("tab"));

    // Json a grabar
    const Pid = {
        type: $(this).attr("tab"),
       
        nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/PidConfig-" + $("#Motor-select-Cal").val() + ".json",
        KP: $("#KP").val(),
        KI: $("#KI").val(),
        KD: $("#KD").val(),
        FlowOnDirection: $("#FlowOnDirection").val(),
        FlowPin: $("#FlowPin").val(),
        Deadband: $("#Deadband").val()
    };

    jsonData = JSON.stringify(Pid);

    client.publish('/NODO/MOTOR/' + $("#Motor-select-Cal").val() + '/' + $(this).attr("tab"), jsonData);
    window.electronAPI.grabarConfig(jsonData)


});

$("#CalConfig").on("click", function () {

    // Json a grabar
    const Cal = {
        type: $(this).attr("tab"),
       
        nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/CalConfig-" + $("#Motor-select-Cal").val() + ".json",
        Auto: $("#Auto").val(),
        ManualPWM: $("#ManualPWM").val(),
        SetPoint: $("#SetPoint").val(),
        MinimumDose: $("#MinimumDose").val(),
        Working_Width: $("#Working_Width").val(),
        PulsePerRev: $("#PulsePerRev").val(),
        HolesPerPlate: $("#HolesPerPlate").val(),
        DosePerUnit: $("#DosePerUnit").val(),
        SeedsPerMeter: $("#SeedsPerMeter").val(),
        SeedsPerHectare: $("#SeedsPerHectare").val(),
        KilosPerHectare: $("#KilosPerHectare").val(),
        LitersPerHectare: $("#LitersPerHectare").val(),
        DosePer: $("#DosePer").val()
    };


    jsonData = JSON.stringify(Cal);
    console.log(jsonData)
    client.publish('/NODO/MOTOR/' + $("#Motor-select-Cal").val() + '/' + $(this).attr("tab"), jsonData);
    window.electronAPI.grabarConfig(jsonData)


});
$("#CloneCalConfig").on("click", function () {

    for (var i = 1; i <= $("#RowsConfig").val(); i++) {
        if ($("#Motor-select-Param").val() != i) {
            const Cal = {
                type: CalConfig,
               
                nombre: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val() + "/CalConfig-" + $("#Motor-select-Param").val() + ".json",
                Auto: $("#Auto").val(),
                ManualPWM: $("#ManualPWM").val(),
                SetPoint: $("#SetPoint").val(),
                MinimumDose: $("#MinimumDose").val(),
                Working_Width: $("#Working_Width").val(),
                PulsePerRev: $("#PulsePerRev").val(),
                HolesPerPlate: $("#HolesPerPlate").val(),
                DosePerUnit: $("#DosePerUnit").val(),
                SeedsPerMeter: $("#SeedsPerMeter").val(),
                SeedsPerHectare: $("#SeedsPerHectare").val(),
                KilosPerHectare: $("#KilosPerHectare").val(),
                LitersPerHectare: $("#LitersPerHectare").val(),
                DosePer: $("#DosePer").val()

            };
            jsonData = JSON.stringify(Cal);
            console.log(jsonData)
            client.publish('/NODO/MOTOR/' + i + '/CalConfig', jsonData);
            window.electronAPI.grabarConfig(jsonData);
        }
    }




});

$("#SampleCollected").on("keyup change", function () {
    $("#DosePerUnit").val($(this).val() / $("#TotalPulses").val());
    $("#SeedByPulses").val($("#TotalPulses").val() / $(this).val());
});

$("#Run").click(function () {
    // Json a grabar
    const SampleDose = {
        type: "SampleDose",
        DosePer: $("#DosePer").val(),
        MaxTurns: $("#MaxTurns").val(),
        PWMMotor: $("#PWMMotor").val()
    };
    jsonData = JSON.stringify(SampleDose);
    client.publish('/NODO/MOTOR/' + $("#Motor-select-Cal").val() + '/SampleDose', jsonData);
});

