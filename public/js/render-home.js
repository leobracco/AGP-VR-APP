



$(document).ready(function () {
    let numero = 0; // Número original
    todos = numero.toString().padStart($("#RowsConfig").val(), '0');
    if (sessionStorage.getItem('Page') == "home") {
        BinDataShow("SeccionesLive", todos);
        $('#changeSize').css('display', 'block');
        //StatusLive("MonitorLive", todos);
    }
    else {
        $('#changeSize').css('display', 'none');
    }


    var tiempo = 5000; // 5 segundos
    var temporizador;

    function reiniciarTemporizador() {
        // Limpiar el temporizador anterior
        clearTimeout(temporizador);

        temporizador = setTimeout(function () {
            //$("#accordionSidebar")
            $('.navbar-nav').css('display', 'none');
        }, tiempo);
    }

    // Escuchar eventos touch y click
    $(document).on('click touchstart mousemove touchmove', function () {
        $('.navbar-nav').css('display', 'block');
        reiniciarTemporizador();

    });

    // Iniciar temporizador en la carga inicial
    reiniciarTemporizador();
    $('#changeSize').on('click', function () {

        let anchoVentana = $(window).width();
        let altoVentana = $(window).height();
        if ($(window).height() != $('#SeccionesView').height()) {
           //alert("Minimizar")
            const anchoTotalMonitor = window.screen.width;
            const altoTotalVentana= $(window).height() 
            const altodelDIV=$('#SeccionesView').height();
            console.log(`Ancho total del div: ${altodelDIV} y de la ventana ${altoTotalVentana}`);
            const objeto = {
                height: $('#SeccionesView').height(),
                widthMon: window.screen.width,
                heightMon: window.screen.height
            };
            const jsonData = JSON.stringify(objeto);
            window.electronAPI.changeSize(jsonData)
            $('html, body').animate({
                scrollTop: $('#SeccionesView').offset().top
            }, 1000);
        }
        else {
            console.log("NoLoad")
            window.electronAPI.maximizeWindow();
        }
        $("#iconSize").toggleClass('fa-minimize fa-maximize');
    });
});

//
