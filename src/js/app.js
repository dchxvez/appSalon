let page = 1;

const userDate = {
    name : '',
    date : '',
    hour : '',
    services : []
}


document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    showServices();

    //Resalta el div actual segun el tab al que se presiona
    showSection();
    //Oculta o muestra segun el tab al que se presiona
    changeSection();

    //Paginacion siguiente y anterior
    nextPage();
    prevPage();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion
    buttonPage();

    //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    showResume();
    
    //Almacena el nombre de la cita en el objeto
    nameUserDate();

    //Almacena la fecha de la cita en el objeto
    dateUserDate();

    //Deshabilita fechas
    disableDates();

    //Almacena la hora de la cita en el objeto
    hourUserDate();
}

function showSection() {

    const prevSection = document.querySelector('.show-section');
    //Eliminar clase show section de la seccion anterior
    if(prevSection) {
        prevSection.classList.remove('show-section');
    }
    const actualSection = document.querySelector(`#tab-${page}`);
    actualSection.classList.add('show-section');

    const prevTab = document.querySelector('.tabs .actual');
    //Eliminar la clase actual en el tab anterior
    if(prevTab){
        prevTab.classList.remove('actual')
    }
    //Resalta el tab actual
    const actualTab = document.querySelector(`[data-tab="${page}"]`);
    actualTab.classList.add('actual');
}

function changeSection() {
    const links = document.querySelectorAll('.tabs button');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            page = parseInt(e.target.dataset.tab);
            showSection();
            buttonPage();
        });
    });
}


async function showServices () {
    try {
        const result = await fetch('../../services.json');
        const db = await result.json();
        const {servicios} = db;
        //Generar el HTML
        servicios.forEach( service => {
            const {id, nombre, precio} = service;
            console.log(service);
            //DOM Scripting
            //Generar nombre servicio
            const serviceName = document.createElement('P');
            serviceName.textContent = nombre;
            serviceName.classList.add('service-name');
            serviceName.classList.add('no-margin');

            //Generar precio servicio
            const servicePrice = document.createElement('P');
            servicePrice.textContent = `$ ${precio}`;
            servicePrice.classList.add('service-price');
            servicePrice.classList.add('no-margin');


            //Generar div contenedor de servicio
            const serviceDIV = document.createElement('DIV');
            serviceDIV.classList.add('service');
            serviceDIV.dataset.idService = id;
            //Selecciona un servicio para la cita
            serviceDIV.onclick = serviceSelected;


            //Inyectar nombre y precio al div
            serviceDIV.appendChild(serviceName);
            serviceDIV.appendChild(servicePrice);

            //Inyectar al HTML
            document.querySelector('#services').appendChild(serviceDIV);
            
        });


    } catch (error) {
        console.log(error);
    }
}


function serviceSelected(e) {
    //FOrzar que el elemento al que le damos click sea al div
    let element;
    if(e.target.tagName === 'P') {
        element = e.target.parentElement;
    } else {
        element = e.target;
    }
    if(element.classList.contains('selected')) {
        element.classList.remove('selected');
        const id = parseInt(element.dataset.idService);
        deleteService(id);
    }else {
        element.classList.add('selected');
        
        const serviceObj = {
            id : parseInt(element.dataset.idService),
            name : element.firstElementChild.textContent,
            price : element.firstElementChild.nextElementSibling.textContent
        }
        
        addService(serviceObj);
    }
    
}

function deleteService(id) {
    const {services} = userDate;
    userDate.services = services.filter(service => service.id !== id);
}

function addService(serviceObj) {
    const { services } = userDate;
    userDate.services = [...services, serviceObj];
}

function nextPage() {
    const nextPage = document.querySelector('#next');
    nextPage.addEventListener('click', () => {
        page++;
        buttonPage();
    });
}

function prevPage() {
    const prevPage = document.querySelector('#prev');
    prevPage.addEventListener('click', () => {
        page--;
        buttonPage();
    });
}

function buttonPage() {
    const nextPage = document.querySelector('#next');
    const prevPage = document.querySelector('#prev');

    if(page === 1) {
        prevPage.classList.add('hide');
        nextPage.classList.remove('hide');
    }else if(page === 3) {
        nextPage.classList.add('hide');
        prevPage.classList.remove('hide');
        showResume();
    }else {
        prevPage.classList.remove('hide');
        nextPage.classList.remove('hide');
    }

    showSection();
}

function showResume() {
    
    //Destructuring al objeto
    const {name, date, hour, services} = userDate;

    //Seleccionar la seccion de resumen(3)
    const resumeSection = document.querySelector('#tab-3');

    //Limpiamos el HTMl previo
    while(resumeSection.firstChild) {
        resumeSection.removeChild(resumeSection.firstChild);
    }
    //Validacion de objeto
    if(Object.values(userDate).includes('') || userDate.services.length === 0) {
        const noData = document.createElement('P');
        noData.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noData.classList.add('invalid-date');
        //Agregar a la seccion de resumen
        resumeSection.appendChild(noData);
        return;
    } 

    //Mostramos el remsumen
    const dateName = document.createElement('P');
    dateName.innerHTML = `<span>Nombre:</span> ${name}`;

    const dateDay = document.createElement('P');
    dateDay.innerHTML = `<span>Fecha:</span> ${date}`;

    const dateHour = document.createElement('P');
    dateHour.innerHTML = `<span>Hora:</span> ${hour}`;

    const clientInfo = document.createElement('H3');
    clientInfo.textContent = 'Resumen Cita';

    const dateResume = document.createElement('DIV');
    dateResume.classList.add('services-resume');

    const serviceInfo = document.createElement('H3');
    serviceInfo.textContent = 'Servicios';

    let total = 0;

    //Iterar sobre el arreglo de servicios
    services.forEach(s => {
        const serviceContainer = document.createElement('DIV');
        serviceContainer.classList.add('service-container');
        const serviceText = document.createElement('P');
        serviceText.textContent = s.name;
        const servicePrice = document.createElement('P');
        servicePrice.textContent = s.price;
        servicePrice.classList.add('service-price');
        const serviceTotal = s.price.split('$');
        total += parseInt(serviceTotal[1].trim());
        //Colocar texto y precio en el DIV
        serviceContainer.appendChild(serviceText);
        serviceContainer.appendChild(servicePrice);
        dateResume.appendChild(serviceContainer);
    });
    
    resumeSection.appendChild(clientInfo);
    resumeSection.appendChild(dateName);
    resumeSection.appendChild(dateDay);
    resumeSection.appendChild(dateHour);
    resumeSection.appendChild(serviceInfo);
    resumeSection.appendChild(dateResume);

    const totalPrice = document.createElement('P');
    totalPrice.classList.add('total');
    totalPrice.innerHTML = `<span>Total a pagar: </span> $${total}`;
    resumeSection.appendChild(totalPrice);
    
}

function nameUserDate() {
    const inputName = document.querySelector('#name');
    inputName.addEventListener('change', e => {
        const inputName = e.target.value.trim();
        //Validacion
        if(inputName === '' || inputName.length < 3){
            showAlert('Nombre no válido', 'error');
        }else {
            userDate.name = inputName;
        }
    });
}

function showAlert(mssg, type) {
    //SI hay una alerta previa entonces no crear otra
    const prevAlert = document.querySelector('.alert');
    if(prevAlert) {
        return;
    }
    const alert = document.createElement('DIV');
    alert.textContent = mssg;
    alert.classList.add('alert');
    if(type === 'error'){
        alert.classList.add('error');
    }
    //Insertar en el HTML
    const form = document.querySelector('.form');
    form.appendChild(alert);

    //Eliminar la alerta despues de 3 seg
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function dateUserDate() {
    const inputDate = document.querySelector('#date');
    inputDate.addEventListener('change', e => {
        const date = new Date(e.target.value).getUTCDay();
        if([0].includes(date)) {
            e.preventDefault();
            inputDate.value = '';
            showAlert('No abrimos los Domingos', 'error');
        } else {
            userDate.date = inputDate.value;
        }
    });
}

function disableDates() {
    const inputDate = document.querySelector('#date');
    const actualDate = new Date();
    const year = actualDate.getFullYear();
    const month = actualDate.getMonth() + 1;
    const day = actualDate.getDate() + 1;
    //Formato deseado: AAAA-MM-DD
    const minDisableDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    const maxDisableDate = `${year + 1}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    inputDate.min = minDisableDate;
    inputDate.max = maxDisableDate;
}

function hourUserDate() {
    const inputHour = document.querySelector('#hour');
    inputHour.addEventListener('change', e => {
        const hourUserDate = e.target.value;
        const hour = hourUserDate.split(':');
        if(hour[0] < 10 || hour[0] >= 20) {
            e.preventDefault();
            inputHour.value = '';
            showAlert('Abrimos 10:00 am y cerramos 8:00 pm', 'error');
        } else{
            userDate.hour = hourUserDate;
        }
    });
}