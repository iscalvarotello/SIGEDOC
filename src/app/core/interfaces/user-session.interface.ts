export interface UserSession {  
    idUser                : string | number ;
    idRol                 : number  ;
    nombre                : string  ;
    apellido1             : string  ;
    apellido2             : string  ;
    fullName              : string  ;
    nickName              : string  ;
    puesto                : string  ;
    telefono              : string  ;
    extension             : string  ;
    email                 : string  ;
    id_area               : string  ;  // Área al que pertenece el usuario (UUID string)
    nombre_area           : string  ; // Nombre del área al que pertenece el usuario
    id_area_base          : string  ;
    nombre_area_base      : string  ; // Es el área agrupante.
    es_jefe               : boolean ;
    es_recepcion          : boolean ;
    country_code          : string  ;
    sex?                  : string  ;
    sucursal?             : string  ;
    ciudad?               : string  ;
    estado?               : string  ;
    pais?                 : string  ;
}


