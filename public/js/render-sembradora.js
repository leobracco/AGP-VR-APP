$("#Save").on("click", function () {
    const Seeder = {
       type: "Seeder",
       nombre: "config/Seeders/" + $("#SeederNamePrev").val() + ".json",
       SeederName: $("#SeederNamePrev").val(),
       Working_Width: $("#Working_Width").val(),
       Rows: $("#Rows").val(),
       RowSpacing: $("#RowSpacing").val(),
    };
    const jsonData = JSON.stringify(Seeder);
    window.electronAPI.grabarConfig(jsonData)
    const SeederConfig = {
       type: "SeederConfig",
       nombre: "config/SeederConfig.json",
       SeederName: $("#SeederNamePrev").val(),
       Working_Width: $("#Working_Width").val(),
       Rows: $("#Rows").val(),
       RowSpacing: $("#RowSpacing").val(),
    };
    const jsonDataConfig = JSON.stringify(SeederConfig);
    window.electronAPI.grabarConfig(jsonDataConfig)
 });
 $("#Clone").on("click", function () {
    $("#CloneModal").modal('show');
 
    $('.modal-backdrop').remove();
 });
 $("#CloneSave").on("click", function () {
    const Seeder = {
       type: "Seeder",
       nombre: "config/Seeders/" + $("#SeederNameClone").val() + ".json",
       SeederName: $("#SeederNameClone").val(),
       Working_Width: $("#Working_Width").val(),
       Rows: $("#Rows").val(),
       RowSpacing: $("#RowSpacing").val(),
    };
    const jsonData = JSON.stringify(Seeder);
    window.electronAPI.grabarConfig(jsonData)
    const SeederConfig = {
       type: "SeederConfig",
       nombre: "config/SeederConfig.json",
       SeederName: $("#SeederNameClone").val(),
       Working_Width: $("#Working_Width").val(),
       Rows: $("#Rows").val(),
       RowSpacing: $("#RowSpacing").val(),
    };
    const jsonDataConfig = JSON.stringify(SeederConfig);
 
    window.electronAPI.grabarConfig(jsonDataConfig)
    $('#CloneModal').modal('toggle');
    nombre = "config/SeederConfig.json";
window.electronAPI.leerConfig(nombre);
    window.electronAPI.readListSeeders();
    nombre = "config/Seeders/" + $("#SeederNameClone").val() + ".json";
    window.electronAPI.leerConfig(nombre);
 });
 jQuery(document).ready(function ($) {
 
 
    window.electronAPI.readListSeeders();
    nombre = "config/Seeders/" + $("#SeederNameConfig").val() + ".json";
    window.electronAPI.leerConfig(nombre);
 
 
 });