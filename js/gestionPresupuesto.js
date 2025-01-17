"use strict";

//Variables globales
let presupuesto = 0;
let gastos = [];
let idGasto = 0;


function actualizarPresupuesto(presupuestoActualizado) { 

    let presupuestoAuxiliar = presupuestoActualizado;

    if (presupuestoAuxiliar >= 0) {   
        presupuesto = presupuestoAuxiliar;    
        } else {
            presupuestoAuxiliar = -1;     
        }

    return presupuestoAuxiliar;               
}


function mostrarPresupuesto() {
    let x = presupuesto;
    return `Tu presupuesto actual es de ${x} €`;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    this.descripcion = descripcion;

    if (valor >= 0) {
        this.valor = valor;
    } else {
        this.valor = 0;
    }

    if (fecha)
    {
        this.fecha = Date.parse(fecha);  
    }   
    else
    {
        this.fecha = Date.now(fecha);  
    }

    if (etiquetas === null)
    {
        this.etiquetas = [];
    }
    else
    {
        this.etiquetas = etiquetas;
    }
    
    this.mostrarGastoCompleto = function()
    {
        let fechaFormatoLocalizado = new Date(this.fecha);

        let gasto = (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaFormatoLocalizado.toLocaleString()}\nEtiquetas:\n- ${etiquetas.join ("\n- ")}\n`);

        return gasto;
    }

    this.actualizarFecha = function(fecha)
    {
        if (fecha = Date.parse(fecha))
        {
            this.fecha = fecha;
        }        
    }

    this.anyadirEtiquetas = function(...etiquetas)
    {
        for (let el of etiquetas)
        {
            if (!this.etiquetas.includes(el))
            {
                this.etiquetas.push(el);
            }
        }  
    }

    this.borrarEtiquetas = function(...etiquetas)
    {
        let indice;  
        for (let el of etiquetas)
        {
            indice = this.etiquetas.indexOf(el); 

            if (indice >=0)
            {
                this.etiquetas.splice(indice, 1);  
            }          
        }
    }


    this.mostrarGasto = function() {
        let gasto = (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`);
        return gasto;
    }

    this.actualizarDescripcion = function (descripcionActualizada) {
        this.descripcion = descripcionActualizada;
    }

    this.actualizarValor = function (valorActualizado) {
        if (valorActualizado > 0) {
            this.valor = valorActualizado;
        }
    }

    this.obtenerPeriodoAgrupacion = function (periodo)
    {
        let fechaAux = new Date(this.fecha);

        fechaAux = fechaAux.toISOString();

        if (periodo == "dia")
        {           
            fechaAux = fechaAux.slice(0,10);
        }  

        else if (periodo == "mes")
        {
            fechaAux = fechaAux.slice(0,7);
        }

        else if (periodo == "anyo")
        {
            fechaAux = fechaAux.slice(0,4);
        }
           
        return fechaAux;
    }
}

function listarGastos()
{
    return gastos;
}

function anyadirGasto(gastoAnyadido)
{
    gastoAnyadido.id = idGasto;

    idGasto++;

    gastos.push(gastoAnyadido);
}

function borrarGasto(gastoBorrado)
{    
    let indice;  
    indice = gastos.findIndex(item => item.id == gastoBorrado);
    
    if (indice >= 0)
    {
        gastos.splice(indice, 1);
    }    
}

function calcularTotalGastos()
{
    let totalGastos = 0;

    for (let i=0; i < gastos.length; i++)
    {
        totalGastos = totalGastos + gastos[i].valor;
    }

    return totalGastos;
}

function calcularBalance()
{
    let balance;

    balance = presupuesto - calcularTotalGastos();

    return balance;
}


function filtrarGastos (opciones)
{
    return gastos.filter(function(gasto) 
    {
        let resultado = true;

        if (opciones.fechaDesde)
        {
            if (gasto.fecha < Date.parse(opciones.fechaDesde))
            {
                resultado = false;
            }
        }

        if (opciones.fechaHasta)
        {
            if(gasto.fecha > Date.parse(opciones.fechaHasta))
            {
                resultado = false;
            }
        }

        if (opciones.valorMinimo) 
        {
            if (gasto.valor < opciones.valorMinimo) 
            {
                resultado = false;
            }
        }
        
        if (opciones.valorMaximo)
        {
            if (gasto.valor > opciones.valorMaximo)
            {
                resultado = false;
            }
        }

        if (opciones.descripcionContiene)
        {
            if (!gasto.descripcion.includes(opciones.descripcionContiene))
            {
                resultado = false;
            }
        }

        if (opciones.etiquetasTiene)
        {           
            let diferenteEtiqueta = true;
            for (let i in opciones.etiquetasTiene)
            {
                for (let j in gasto.etiquetas)
                {
                    if (opciones.etiquetasTiene[i] == gasto.etiquetas[j])
                    {                        
                        diferenteEtiqueta = false;
                    }
                }
            }

            if (diferenteEtiqueta)
            {
                resultado = false;
            }
        }
        
        return resultado;
    });
}

function agruparGastos(periodo, etiquetas, fechaDesde, fechaHasta)
{  
    let etiquetasTiene = etiquetas; 
    let gastosFiltrados = filtrarGastos({etiquetasTiene, fechaDesde, fechaHasta});
      
    return gastosFiltrados.reduce(function(acc, gasto)
    {
        
        let pA = gasto.obtenerPeriodoAgrupacion(periodo);   

        acc[pA] = (acc[pA] || 0) + gasto.valor;
    
        return acc;       
    }, {});
}

function transformarListadoEtiquetas(etiquetasTiene)
{
    let regexp = /\w+/g;

    let resultado = etiquetasTiene.match(regexp);

    return resultado;
}

/*
//Vamos a añadir esta función al paquete gestionPresupuesto.js. 
//La función será extremadamente sencilla: tomará como parámetro un array de gastos que se utilizará para sobreescribir la variable global gastos.
function cargarGastos(sobreescribirGastosGlobal)
{
    gastos = sobreescribirGastosGlobal;
}
Esta función era la que utilizabamos en el primer trimestre. La modificamos para que siga pasando los test, ya que en la practica libreria externa va a dar error.
*/


function cargarGastos(gastosAlmacenamiento) {
    // gastosAlmacenamiento es un array de objetos "planos"
    // No tienen acceso a los métodos creados con "CrearGasto":
    // "anyadirEtiquetas", "actualizarValor",...
    // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas
  
    // Reseteamos la variable global "gastos"
    gastos = [];
    // Procesamos cada gasto del listado pasado a la función
    for (let g of gastosAlmacenamiento) {
        // Creamos un nuevo objeto mediante el constructor
        // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
        // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
        let gastoRehidratado = new CrearGasto();
        // Copiamos los datos del objeto guardado en el almacenamiento
        // al gasto rehidratado
        // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
        Object.assign(gastoRehidratado, g);
        // Ahora "gastoRehidratado" tiene las propiedades del gasto
        // almacenado y además tiene acceso a los métodos de "CrearGasto"
          
        // Añadimos el gasto rehidratado a "gastos"
        gastos.push(gastoRehidratado)
    }
}


export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance, 
    filtrarGastos, 
    agruparGastos,
    transformarListadoEtiquetas, 
    //Por último, se deberá exportar la función cargarGastos.
    cargarGastos
}