import { Injectable } from '@angular/core';
import { UserSession } from '../interfaces/user-session.interface';


@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor( ) { }

  public dataUser:UserSession = {
    idUser                : 1                                                  , // Administrador
    idRol                 : 1                                                  , // Administrador
    nombre                : 'Alvaro'                                           ,
    apellido1             : 'Tello'                                            ,
    apellido2             : 'Gutierrez'                                        ,
    fullName              : 'Alvaro Tello Gutiérrez'                           ,
    nickName              : 'Tello'                                            ,
    puesto                : 'Asesor empresarial'                               ,
    telefono              : '9614621946'                                       ,
    extension             : '66053'                                            ,
    email                 : 'iscalvarotello@gmail.com'                         ,
    id_area               : 45                                                 ,
    nombre_area           : 'Dirección de Atención y Servicios Empresariales'  ,
    id_area_base          : 45                                                 ,
    nombre_area_base      : 'Dirección de Atención y Servicios Empresariales'  , 
    es_jefe               : false                                              ,
    es_recepcion          : false                                              ,
    country_code          : '52'
  }

  getUserSesion () {
      
  }

}
