BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "tipo_usuario" (
	"id"	INTEGER,
	"nombre"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "materia" (
	"id"	INTEGER,
	"codigo"	INTEGER NOT NULL UNIQUE,
	"nombre"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "materia_anio" (
	"id"	INTEGER,
	"materia_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "carga_academica" (
	"id"	INTEGER,
	"periodo_id"	INTEGER NOT NULL,
	"docente_id"	INTEGER NOT NULL,
	"materia_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"seccion"	TEXT NOT NULL,
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	FOREIGN KEY("docente_id") REFERENCES "docente"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
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
CREATE TABLE IF NOT EXISTS "representante_estudiante" (
	"id"	INTEGER,
	"representante_id"	INTEGER NOT NULL,
	"estudiante_id"	INTEGER NOT NULL,
	FOREIGN KEY("representante_id") REFERENCES "representante"("id"),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
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
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "usuario" (
	"id"	INTEGER,
	"nombre_usuario"	TEXT,
	"clave_acceso"	TEXT,
	"activo"	INTEGER NOT NULL DEFAULT 0 CHECK("activo" IN (0, 1)),
	"tipo_usuario_id"	INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("tipo_usuario_id") REFERENCES "tipo_usuario"("id")
);
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
CREATE TABLE IF NOT EXISTS "estudiante" (
	"id"	INTEGER,
	"datos_personales_id"	INTEGER UNIQUE,
	"discapacidad"	TEXT,
	"estado_academico"	TEXT NOT NULL CHECK("estado_academico" IN ("Activo", "Inactivo", "Graduado", "Suspendido")),
	"fecha_ingreso"	DATE,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id")
);
CREATE TABLE IF NOT EXISTS "periodo_academico" (
	"id"	INTEGER,
	"nombre"	TEXT,
	"fecha_inicio"	TEXT,
	"fecha_fin"	TEXT,
	"finalizado"	INTEGER NOT NULL CHECK("finalizado" IN (0, 1)),
	"lapso_activo"	INTEGER NOT NULL CHECK("lapso_activo" IN (0, 1, 2, 3)),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "periodo_seccion" (
	"id"	INTEGER,
	"periodo_id"	INTEGER NOT NULL,
	"seccion"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	UNIQUE("periodo_id","seccion")
);
CREATE TABLE IF NOT EXISTS "calificacion" (
	"id"	INTEGER,
	"estudiante_id"	INTEGER NOT NULL,
	"materia_id"	INTEGER NOT NULL,
	"periodo_id"	INTEGER NOT NULL,
	"docente_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"lapso"	INTEGER NOT NULL CHECK("lapso" IN (1, 2, 3)),
	"seccion"	TEXT NOT NULL,
	"calificacion"	REAL NOT NULL CHECK("calificacion" >= 0),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("docente_id") REFERENCES "docente"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id")
);
INSERT INTO "tipo_usuario" VALUES (1,'Docente');
INSERT INTO "tipo_usuario" VALUES (2,'Coordinador');
INSERT INTO "tipo_usuario" VALUES (3,'Representante');
INSERT INTO "coordinador" VALUES (1,1,1,'01/04/2022',NULL,1,'ana.martinez@email.com','anita@yahoo.com','251-6665432','424-9876543');
INSERT INTO "coordinador" VALUES (2,2,2,'15/05/2022',NULL,1,'juan.perez@email.com','juanito@gmail.com','212-5551234','412-9876543');
INSERT INTO "coordinador" VALUES (3,3,3,'10/03/2022',NULL,1,'maria.gonzalez@email.com','maria.ale@gmail.com','241-7779876','414-5432109');
INSERT INTO "coordinador" VALUES (4,4,4,'20/06/2022',NULL,1,'luis.rodriguez@email.com','luisito@hotmail.com','243-8887654','416-4321098');
INSERT INTO "coordinador" VALUES (5,5,5,'05/02/2022',NULL,1,'pedro.sanchez@email.com','pedrito@gmail.com','274-5554321','412-8765432');
INSERT INTO "coordinador" VALUES (6,6,6,'30/07/2022',NULL,1,'laurival@gmail.com','laura.valentina@email.com','0288-6545123','416-3245555');
INSERT INTO "usuario" VALUES (1,'coord1','coord1-123',1,2);
INSERT INTO "usuario" VALUES (2,'coord2','coord2-123',1,2);
INSERT INTO "usuario" VALUES (3,'coord3','coord3-123',1,2);
INSERT INTO "usuario" VALUES (4,'coord4','coord4-123',1,2);
INSERT INTO "usuario" VALUES (5,'coord5','coord5-123',1,2);
INSERT INTO "usuario" VALUES (6,'coord6','coord6-123',1,2);
INSERT INTO "persona" VALUES (1,'Juan','Carlos','Pérez','González',10,'Masculino','1990-05-15','Caracas','Distrito Capital','Venezuela','Av. Principal 123','Soltero');
INSERT INTO "persona" VALUES (2,'María','Isabel','Rodríguez','López',11,'Femenino','1985-08-20','Valencia','Carabobo','Venezuela','Calle 456','Casado');
INSERT INTO "persona" VALUES (3,'Pedro',NULL,'García','Martínez',12,'Masculino','2000-03-10','Maracaibo','Zulia','Venezuela','Carrera 789','Soltero');
INSERT INTO "persona" VALUES (4,'Ana','Luisa','Fernández','Sánchez',13,'Femenino','1998-11-25','Barquisimeto','Lara','Venezuela','Avenida 987','Soltero');
INSERT INTO "persona" VALUES (5,'Carlos','Alberto','Ramírez','Pérez',14,'Masculino','1982-07-05','San Cristóbal','Táchira','Venezuela','Calle 654','Casado');
INSERT INTO "persona" VALUES (6,'Laura','Elena','Gómez','Hernández',15,'Femenino','1995-02-18','Mérida','Mérida','Venezuela','Carrera 321','Divorciado');
INSERT INTO "persona" VALUES (7,'Juan','Carlos','Pérez','González',16,'Masculino','1990-05-15','Caracas','Distrito Capital','Venezuela','Av. Principal 123','Soltero');
COMMIT;
