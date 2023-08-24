var previousSelected = [];
function obtenerNombreSinEspacios(selector) {

   return $(selector).val().replace(/\s+/g, '');
}

function crearSeederConfig(seederNameSelector) {
   return {
      type: "SeederConfig",
      nombre: "config/SeederConfig.json",
      SeederNameConfig: $(seederNameSelector).val(),
      SeederNameNoSpacesConfig: obtenerNombreSinEspacios(seederNameSelector),
      Working_WidthConfig: $("#Working_Width").val(),
      RowsConfig: $("#Rows").val(),
      RowSpacingConfig: $("#RowSpacing").val(),
   };
}

function crearSeeder(seederNameSelector) {
   const seederNameNoSpaces = obtenerNombreSinEspacios(seederNameSelector);
   return {
      type: "Seeder",
      nombre: `config/Seeders/${seederNameNoSpaces}/Config.json`,
      Directory: `config/Seeders/${seederNameNoSpaces}`,
      SeederName: $(seederNameSelector).val(),
      SeederNameNoSpaces: seederNameNoSpaces,
      Working_Width: $("#Working_Width").val(),
      Rows: $("#Rows").val(),
      RowSpacing: $("#RowSpacing").val(),
   };
}

function grabarConfig(objeto) {
   const jsonData = JSON.stringify(objeto);
   window.electronAPI.grabarConfig(jsonData);
}

// Eventos
$("#Save").on("click", function () {
  
      grabarConfig(crearSeeder("#SeederName"));
      grabarConfig(crearSeederConfig("#SeederName"));

   

});

$("#Clone").on("click", function () {
   $("#CloneModal").modal('show');
   $('.modal-backdrop').remove();
});

$("#CloneSave").on("click", function () {
   if (searchSeeder(obtenerNombreSinEspacios("#SeederNameClone"))) {
      $('#bootstrapAlert').text('El valor  ya existe en la lista.').show();
   }
   else {
   grabarConfig(crearSeeder("#SeederNameClone"));
   grabarConfig(crearSeederConfig("#SeederNameClone"));
   $('#CloneModal').modal('toggle');
   const nombre = "config/Seeders/" + obtenerNombreSinEspacios("#SeederNameClone") + ".json";
   const objeto = {
      origen: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val(),
      destino: "config/Seeders/" + obtenerNombreSinEspacios("#SeederNameClone")
   };
   const jsonData = JSON.stringify(objeto);
   window.electronAPI.cloneSeeder(jsonData)
   window.electronAPI.leerConfig(nombre);

   window.electronAPI.readListSeeders();
}
});
$("#New").on("click", function () {

   $("#SeederName").val("");
   $("#Working_Width").val("");
   $("#Rows").val("");
   $("#RowSpacing").val("");


});


// Evento cuando se cambia la selección
$('#SeederNameList').on('change', function () {
   var selectedOptions = $(this).val();
   console.log("Console.log:"+selectedOptions)
   $("#SeederNameList option[value='"+$("#SeederNameNoSpacesConfig").val()+"']").addClass('previous-selection')
   //$(this).find('option:selected').addClass('previous-selection');

});

// Evento al hacer clic en el botón load
$('#Load').on('click', function () {
   
   $("#SeederNameList option[value='"+$("#SeederNameNoSpacesConfig").val()+"']").removeClass('previous-selection')
   $("#SeederNameNoSpacesConfig").val($("#SeederNameList").val())
   const objeto = {
      origen: "config/Seeders/" + $("#SeederNameNoSpacesConfig").val()+"/Config.json",
      destino: "config/SeederConfig.json"
   };
   const jsonData = JSON.stringify(objeto);
   window.electronAPI.loadSeeder(jsonData)

   const seederName = obtenerNombreSinEspacios("#SeederNameNoSpacesConfig");
   const nombre = `config/Seeders/${seederName}/Config.json`;
   window.electronAPI.leerConfig(nombre);
   window.electronAPI.readListSeeders();
   console.log("Load")
});
function searchSeeder(value) {
   return $('#SeederNameList option[value="' + value + '"]').length > 0;
}
jQuery(document).ready(function ($) {
   const seederName = obtenerNombreSinEspacios("#SeederNameNoSpacesConfig");
   const nombre = `config/Seeders/${seederName}/Config.json`;
   window.electronAPI.leerConfig(nombre);
   window.electronAPI.readListSeeders();
   if (sessionStorage.getItem('Page') != "home")

   $('#changeSize').css('display', 'none');
});



