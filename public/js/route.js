$(document).ready(function () {
  if (sessionStorage.getItem('Page') != null)
  Get(sessionStorage.getItem('Page'))
  else
  Get("home")
});
function Get(file) {
  console.log(file);
  if (file == "") 
  file= sessionStorage.getItem('Page')
  else
  sessionStorage.setItem('Page', file)

  $("#menuActual").val(file);
  // Cargar el archivo HTML usando AJAX
  $.ajax({
    url: "partials/" + file + ".html",
    dataType: "html",
    success: function (response) {
      // Agregar el contenido al div con el id "miDiv"
      $("#content-wrapper").html(response);
    },
    error: function () {
      console.log("Error al cargar el archivo HTML.");
    }
  });
}
