import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avances';

const tareas = document.querySelector('.listado-pendientes');
if (tareas) {
    tareas.addEventListener('click', e => {
        const icon = e.target;
        if (icon.classList.contains('fa-check-circle')) {
            const tareaId = icon.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/tarea/${tareaId}`;

            axios.patch(url, { tareaId })
                .then(function(respuesta) {
                    if (respuesta.status === 200) {
                        icon.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }

        if (icon.classList.contains('fa-trash')) {
            const elementoHTML = icon.parentElement.parentElement;
            const tareaId = elementoHTML.dataset.tarea;

            Swal.fire({
                title: 'Desea borrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tarea/${tareaId}`;
                    axios.delete(url, { params: { tareaId } })
                        .then( function(respuesta) {
                            if (respuesta.status === 200) {
                                elementoHTML.parentElement.removeChild(elementoHTML);
                                actualizarAvance();
                                Swal.fire(
                                    'Proyecto eliminado!',
                                    respuesta.data,
                                    'success'
                                );
                            }
                        })
                        .catch(() => {
                            Swal.fire({
                                type: 'error',
                                title: 'Ha ocurrido un error inesperado!',
                                text: 'No se ha podido eliminar el proyecto'
                            });
                        });
                }
            });
        }
    });
}

export default tareas;