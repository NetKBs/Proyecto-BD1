BEGIN TRANSACTION;
DROP TABLE IF EXISTS "tipo_usuario";
CREATE TABLE IF NOT EXISTS "tipo_usuario" (
	"id"	INTEGER,
	"nombre"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
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
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "carga_academica";
CREATE TABLE IF NOT EXISTS "carga_academica" (
	"id"	INTEGER,
	"periodo_id"	INTEGER NOT NULL,
	"docente_id"	INTEGER NOT NULL,
	"materia_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"seccion"	TEXT NOT NULL,
	FOREIGN KEY("docente_id") REFERENCES "docente"("id"),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
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
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "inscripcion_estudiante_anio";
CREATE TABLE IF NOT EXISTS "inscripcion_estudiante_anio" (
	"id"	INTEGER,
	"estudiante_id"	INTEGER NOT NULL,
	"periodo_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"seccion"	TEXT NOT NULL,
	"aprobado"	INTEGER CHECK("aprobado" IN (0, 1)),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "representante_estudiante";
CREATE TABLE IF NOT EXISTS "representante_estudiante" (
	"id"	INTEGER,
	"representante_id"	INTEGER NOT NULL,
	"estudiante_id"	INTEGER NOT NULL,
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("representante_id") REFERENCES "representante"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
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
	"correo"	TEXT,
	"correo_alt"	TEXT,
	"telefono"	TEXT,
	"telefono_alt"	TEXT,
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id"),
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id"),
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
	"correo"	TEXT,
	"correo_alt"	TEXT,
	"telefono"	TEXT,
	"telefono_alt"	TEXT,
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id"),
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
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
	"correo"	TEXT,
	"correo_alt"	TEXT,
	"telefono"	TEXT,
	"telefono_alt"	TEXT,
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id"),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id")
);
DROP TABLE IF EXISTS "usuario";
CREATE TABLE IF NOT EXISTS "usuario" (
	"id"	INTEGER,
	"nombre_usuario"	TEXT,
	"clave_acceso"	TEXT,
	"activo"	INTEGER NOT NULL DEFAULT 0 CHECK("activo" IN (0, 1)),
	"tipo_usuario_id"	INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("tipo_usuario_id") REFERENCES "tipo_usuario"("id")
);
DROP TABLE IF EXISTS "persona";
CREATE TABLE IF NOT EXISTS "persona" (
	"id"	INTEGER,
	"primer_nombre"	TEXT,
	"segundo_nombre"	TEXT,
	"primer_apellido"	TEXT,
	"segundo_apellido"	TEXT,
	"cedula"	INTEGER UNIQUE,
	"genero"	TEXT,
	"fecha_nacimiento"	DATE,
	"ciudad_nacimiento"	TEXT,
	"estado_nacimiento"	TEXT,
	"pais_nacimiento"	TEXT,
	"casa_direccion"	TEXT,
	"estado_civil"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "estudiante";
CREATE TABLE IF NOT EXISTS "estudiante" (
	"id"	INTEGER,
	"datos_personales_id"	INTEGER UNIQUE,
	"discapacidad"	TEXT,
	"estado_academico"	TEXT NOT NULL CHECK("estado_academico" IN ("Activo", "Inactivo", "Graduado", "Suspendido")),
	"fecha_ingreso"	DATE,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id")
);
DROP TABLE IF EXISTS "periodo_academico";
CREATE TABLE IF NOT EXISTS "periodo_academico" (
	"id"	INTEGER,
	"nombre"	TEXT,
	"fecha_inicio"	TEXT,
	"fecha_fin"	TEXT,
	"finalizado"	INTEGER NOT NULL CHECK("finalizado" IN (0, 1)),
	"lapso_activo"	INTEGER NOT NULL CHECK("lapso_activo" IN (0, 1, 2, 3)),
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "tipo_usuario" VALUES (1,'Coordinador');
INSERT INTO "tipo_usuario" VALUES (2,'Representante');
INSERT INTO "tipo_usuario" VALUES (3,'Docente');
INSERT INTO "representante" VALUES (3,NULL,17,'2024-7-11','','',1,'','','','');
INSERT INTO "representante" VALUES (5,NULL,19,'2024-7-11','','',1,'','','','');
INSERT INTO "representante" VALUES (6,NULL,20,'2024-7-11','','',1,'','','','');
INSERT INTO "representante" VALUES (7,NULL,21,'2024-7-11','','',1,'','','','');
INSERT INTO "representante" VALUES (8,NULL,22,'2024-7-11','','',1,'','','','');
INSERT INTO "coordinador" VALUES (1,1,1,'01/04/2022',NULL,1,'ana.martinez@email.com','anita@yahoo.com','251-6665432','424-9876543');
INSERT INTO "coordinador" VALUES (2,2,2,'15/05/2022',NULL,1,'juan.perez@email.com','juanito@gmail.com','212-5551234','412-9876543');
INSERT INTO "coordinador" VALUES (3,3,3,'10/03/2022',NULL,1,'maria.gonzalez@email.com','maria.ale@gmail.com','241-7779876','414-5432109');
INSERT INTO "coordinador" VALUES (4,4,4,'20/06/2022',NULL,1,'luis.rodriguez@email.com','luisito@hotmail.com','243-8887654','416-4321098');
INSERT INTO "coordinador" VALUES (5,5,5,'05/02/2022',NULL,1,'pedro.sanchez@email.com','pedrito@gmail.com','274-5554321','412-8765432');
INSERT INTO "coordinador" VALUES (6,6,6,'30/07/2022',NULL,1,'laurival@gmail.com','laura.valentina@email.com','0288-6545123','416-3245555');
INSERT INTO "usuario" VALUES (1,'coord1','coord1-123',1,1);
INSERT INTO "usuario" VALUES (2,'coord2','coord2-123',1,1);
INSERT INTO "usuario" VALUES (3,'coord3','coord3-123',1,1);
INSERT INTO "usuario" VALUES (4,'coord4','coord4-123',1,1);
INSERT INTO "usuario" VALUES (5,'coord5','coord5-123',1,1);
INSERT INTO "usuario" VALUES (6,'coord6','coord6-123',1,1);
INSERT INTO "persona" VALUES (1,'Ana','Gabriela','Martínez','López',45678901,'F','05/09/1995','Barquisimeto','Lara','Venezuela','Av. Bolívar, Urb. Los Álamos, Barquisimeto','Soltero');
INSERT INTO "persona" VALUES (2,'Juan','Carlos','Pérez','Rodríguez',12345678,'M','15/03/1985','Petare','Caracas','Venezuela','Av. Principal, Urb. Los Pinos, Caracas','Casado');
INSERT INTO "persona" VALUES (3,'María','Alejandra','González','Martínez',23456789,'F','20/07/1990','Valencia','Carabobo','Venezuela','Calle Los Jardines, Urb. El Bosque, Valencia','Soltero');
INSERT INTO "persona" VALUES (4,'Luis','Eduardo','Rodríguez','Pérez',34567890,'M','10/11/1980','Maracay','Aragua','Venezuela','Calle Los Pinos, Urb. El Paraíso, Maracay','Casado');
INSERT INTO "persona" VALUES (5,'Pedro','Alejandro','Sánchez','García',56789012,'M','25/12/1988','Mérida','Mérida','Venezuela','Calle Los Andes, Urb. San Juan, Mérida','Soltero');
INSERT INTO "persona" VALUES (6,'Laura','Valentina','Fernández','Ramírez',67890123,'F','18/04/1992','Guayana','Bolivar','Venezuela','Av. Los Alacranes','Soltero');
INSERT INTO "persona" VALUES (17,'pepe','domingo','ramitos','flores',555,'Masculino','','','','','','Soltero');
INSERT INTO "persona" VALUES (18,'Carlos','','','',777,'Masculino','','','','','','Soltero');
INSERT INTO "persona" VALUES (19,'Pepito','','','',999,'Masculino','','','','','','Soltero');
INSERT INTO "persona" VALUES (20,'Mauricio','','','',888,'Masculino','','','','','','Soltero');
INSERT INTO "persona" VALUES (21,'Mauricio','','','',123,'Masculino','','','','','','Soltero');
INSERT INTO "persona" VALUES (22,'dsfsdfsdafsdafdsaf','','','',6753425342,'Masculino','','','','','','Soltero');
INSERT INTO "persona" VALUES (29,'Caillou','José','González','Jimenez',12345,'Masculino','2019-01-29','Guayana','Bolivar','Venezuela','no','Soltero');
INSERT INTO "persona" VALUES (30,'Jaimito','Nose','nose','',777888,'Masculino','2017-06-14','Guayana','Bolivar','Venezuela','','Soltero');
INSERT INTO "persona" VALUES (32,'Alguien','','Rincones','',999888,'Femenino','','','','','','Soltero');
INSERT INTO "estudiante" VALUES (2,29,'bobo','Activo','2024-7-12');
INSERT INTO "estudiante" VALUES (3,30,'Tarado','Suspendido','2024-7-12');
INSERT INTO "estudiante" VALUES (4,32,'','Activo','2024-7-12');
COMMIT;
