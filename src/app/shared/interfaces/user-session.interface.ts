export interface UserSession {  
    idUser                : number  ;
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
    id_area               : number  ;  // Área al que pertenece el usuario
    nombre_area           : string  ; // Nombre del área al que pertenece el usario
    id_area_base          : number  ;
    nombre_area_base      : string  ; // Es el área agrupante. A veces algunos pueden estar estructuralmente en una jefatura, pero el área que los agrupa a todos es la dirección.
    es_jefe               : boolean ;
    es_recepcion          : boolean ;
    country_code          : string  ;
}
