BEGIN TRANSACTION;
DROP TABLE IF EXISTS "tipo_usuario";
CREATE TABLE IF NOT EXISTS "tipo_usuario" (
	"id"	INTEGER,
	"nombre"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "coordinador";
CREATE TABLE IF NOT EXISTS "coordinador" (
	"id"	INTEGER,
	"usuario_id"	INTEGER UNIQUE,
	"datos_personales_id"	INTEGER NOT NULL UNIQUE,
	"fecha_ingreso"	DATE NOT NULL,
	"fecha_salida"	DATE,
	"activo"	INTEGER NOT NULL CHECK("activo" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "datos_personales"("id"),
	FOREIGN KEY("usuario_id") REFERENCES "credenciales_usuario"("id")
);
DROP TABLE IF EXISTS "docente";
CREATE TABLE IF NOT EXISTS "docente" (
	"id"	INTEGER,
	"usuario_id"	INTEGER UNIQUE,
	"datos_personales_id"	INTEGER UNIQUE,
	"titulo_academico"	TEXT,
	"especialidad"	TEXT,
	"fecha_ingreso"	DATE,
	"fecha_salida"	DATE,
	"activo"	INTEGER NOT NULL CHECK("activo" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "datos_personales"("id"),
	FOREIGN KEY("usuario_id") REFERENCES "credenciales_usuario"("id")
);
DROP TABLE IF EXISTS "estudiante";
CREATE TABLE IF NOT EXISTS "estudiante" (
	"id"	INTEGER,
	"datos_personales_id"	INTEGER UNIQUE,
	"discapacidad"	TEXT,
	"estado_academico"	TEXT NOT NULL CHECK("estado_academico" IN ("Activo", "Inactivo", "Graduado")),
	"fecha_ingreso"	DATE,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "datos_personales"("id")
);
DROP TABLE IF EXISTS "periodo_academico";
CREATE TABLE IF NOT EXISTS "periodo_academico" (
	"id"	INTEGER,
	"coordinador_id"	INTEGER NOT NULL,
	"fecha_inicio"	TEXT,
	"fecha_fin"	TEXT,
	"finalizado"	INTEGER NOT NULL CHECK("finalizado" IN (0, 1)),
	"lapso_activo"	INTEGER NOT NULL CHECK("lapso_activo" IN (0, 1, 2, 3)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("coordinador_id") REFERENCES "coordinador"("id")
);
DROP TABLE IF EXISTS "periodo_seccion";
CREATE TABLE IF NOT EXISTS "periodo_seccion" (
	"id"	INTEGER,
	"periodo_id"	INTEGER NOT NULL,
	"seccion"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "materia";
CREATE TABLE IF NOT EXISTS "materia" (
	"id"	INTEGER,
	"codigo"	INTEGER NOT NULL UNIQUE,
	"nombre"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "materia_anio";
CREATE TABLE IF NOT EXISTS "materia_anio" (
	"id"	INTEGER,
	"materia_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id")
);
DROP TABLE IF EXISTS "carga_academica";
CREATE TABLE IF NOT EXISTS "carga_academica" (
	"id"	INTEGER,
	"periodo_id"	INTEGER NOT NULL,
	"docente_id"	INTEGER NOT NULL,
	"materia_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"seccion"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	FOREIGN KEY("docente_id") REFERENCES "docente"("id")
);
DROP TABLE IF EXISTS "calificacion";
CREATE TABLE IF NOT EXISTS "calificacion" (
	"id"	INTEGER,
	"estudiante_id"	INTEGER NOT NULL,
	"materia_id"	INTEGER NOT NULL,
	"periodo_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"lapso"	INTEGER NOT NULL CHECK("lapso" IN (1, 2, 3)),
	"seccion"	TEXT NOT NULL,
	"calificacion"	REAL NOT NULL CHECK("calificacion" >= 0),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id")
);
DROP TABLE IF EXISTS "inscripcion_estudiante_anio";
CREATE TABLE IF NOT EXISTS "inscripcion_estudiante_anio" (
	"id"	INTEGER,
	"estudiante_id"	INTEGER NOT NULL,
	"periodo_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"seccion"	TEXT NOT NULL,
	"aprobado"	INTEGER CHECK("aprobado" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id")
);
DROP TABLE IF EXISTS "representante";
CREATE TABLE IF NOT EXISTS "representante" (
	"id"	INTEGER,
	"usuario_id"	INTEGER UNIQUE,
	"datos_personales_id"	INTEGER UNIQUE,
	"fecha_ingreso"	DATE NOT NULL,
	"trabajo"	TEXT,
	"lugar_trabajo"	TEXT,
	"activo"	INTEGER NOT NULL CHECK("activo" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("usuario_id") REFERENCES "credenciales_usuario"("id"),
	FOREIGN KEY("datos_personales_id") REFERENCES "datos_personales"("id")
);
DROP TABLE IF EXISTS "credenciales_usuario";
CREATE TABLE IF NOT EXISTS "credenciales_usuario" (
	"id"	INTEGER,
	"nombre_usuario"	TEXT,
	"clave_acceso"	TEXT,
	"activo"	INTEGER NOT NULL DEFAULT 0 CHECK("activo" IN (0, 1)),
	"tipo_usuario_id"	INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("tipo_usuario_id") REFERENCES "tipo_usuario"("id")
);
DROP TABLE IF EXISTS "representante_estudiante";
CREATE TABLE IF NOT EXISTS "representante_estudiante" (
	"id"	INTEGER,
	"representante_id"	INTEGER NOT NULL,
	"estudiante_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("representante_id") REFERENCES "representante"("id")
);
DROP TABLE IF EXISTS "datos_personales";
CREATE TABLE IF NOT EXISTS "datos_personales" (
	"id"	INTEGER,
	"primer_nombre"	TEXT,
	"segundo_nombre"	TEXT,
	"primer_apellido"	TEXT,
	"segundo_apellido"	TEXT,
	"cedula"	INTEGER UNIQUE,
	"genero"	TEXT CHECK("genero" IN ("M", "F")),
	"fecha_nacimiento"	DATE,
	"ciudad_nacimiento"	TEXT,
	"estado_nacimiento"	TEXT,
	"pais_nacimiento"	TEXT,
	"casa_direccion"	TEXT,
	"coreo"	TEXT,
	"coreo_alt"	TEXT,
	"telefono"	TEXT,
	"telefono_alt"	TEXT,
	"estado_civil"	TEXT CHECK("estado_civil" IN ("Soltero", "Casado")),
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "tipo_usuario" VALUES (1,'Coordinador');
INSERT INTO "tipo_usuario" VALUES (2,'Representante');
INSERT INTO "coordinador" VALUES (1,NULL,1,'01/04/2022',NULL,1);
INSERT INTO "coordinador" VALUES (2,NULL,2,'15/05/2022',NULL,1);
INSERT INTO "coordinador" VALUES (3,NULL,3,'10/03/2022',NULL,1);
INSERT INTO "coordinador" VALUES (4,NULL,4,'20/06/2022',NULL,1);
INSERT INTO "coordinador" VALUES (5,NULL,5,'05/02/2022',NULL,1);
INSERT INTO "coordinador" VALUES (6,NULL,6,'30/07/2022',NULL,1);
INSERT INTO "credenciales_usuario" VALUES (1,'coord1','coord1-123',1,1);
INSERT INTO "credenciales_usuario" VALUES (2,'coord2','coord2-123',1,1);
INSERT INTO "credenciales_usuario" VALUES (3,'coord3','coord3-123',1,1);
INSERT INTO "credenciales_usuario" VALUES (4,'coord4','coord4-123',1,1);
INSERT INTO "credenciales_usuario" VALUES (5,'coord5','coord5-123',1,1);
INSERT INTO "credenciales_usuario" VALUES (6,'coord6','coord6-123',1,1);
INSERT INTO "datos_personales" VALUES (1,'Ana','Gabriela','Martínez','López',45678901,'F','05/09/1995','Barquisimeto','Lara','Venezuela','Av. Bolívar, Urb. Los Álamos, Barquisimeto','ana.martinez@email.com','anita@yahoo.com','251-6665432','424-9876543','Soltero');
INSERT INTO "datos_personales" VALUES (2,'Juan','Carlos','Pérez','Rodríguez',12345678,'M','15/03/1985','Petare','Caracas','Venezuela','Av. Principal, Urb. Los Pinos, Caracas','juan.perez@email.com','juanito@gmail.com','212-5551234','412-9876543','Casado');
INSERT INTO "datos_personales" VALUES (3,'María','Alejandra','González','Martínez',23456789,'F','20/07/1990','Valencia','Carabobo','Venezuela','Calle Los Jardines, Urb. El Bosque, Valencia','maria.gonzalez@email.com','maria.ale@gmail.com','241-7779876','414-5432109','Soltero');
INSERT INTO "datos_personales" VALUES (4,'Luis','Eduardo','Rodríguez','Pérez',34567890,'M','10/11/1980','Maracay','Aragua','Venezuela','Calle Los Pinos, Urb. El Paraíso, Maracay','luis.rodriguez@email.com','luisito@hotmail.com','243-8887654','416-4321098','Casado');
INSERT INTO "datos_personales" VALUES (5,'Pedro','Alejandro','Sánchez','García',56789012,'M','25/12/1988','Mérida','Mérida','Venezuela','Calle Los Andes, Urb. San Juan, Mérida','pedro.sanchez@email.com','pedrito@gmail.com','274-5554321','412-8765432','Soltero');
INSERT INTO "datos_personales" VALUES (6,'Laura','Valentina','Fernández','Ramírez',67890123,'F','18/04/1992','Guayana','Bolivar','Venezuela','Av. Los Alacranes','laurival@gmail.com','laura.valentina@email.com','0288-6545123','0416-3245555','Soltero');
COMMIT;
