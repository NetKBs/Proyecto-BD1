BEGIN TRANSACTION;
DROP TABLE IF EXISTS "tipo_usuario";
CREATE TABLE IF NOT EXISTS "tipo_usuario" (
	"id"	INTEGER,
	"nombre"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "datos_personales";
CREATE TABLE IF NOT EXISTS "datos_personales" (
	"id"	INTEGER,
	"primer_nombre"	TEXT,
	"segundo_nombre"	TEXT,
	"primer_apellido"	TEXT,
	"segundo_apellido"	TEXT,
	"edad"	INTEGER CHECK("edad" >= 0),
	"cedula"	INTEGER UNIQUE,
	"genero"	TEXT CHECK("genero" IN ("M", "F")),
	"fecha_nacimiento"	DATE,
	"ciudad_nacimiento"	TEXT,
	"estado_nacimiento"	TEXT,
	"pais_nacimiento"	TEXT,
	"casa_direccion"	TEXT,
	"coreo"	TEXT,
	"coreo_alt"	TEXT,
	"telefono"	INTEGER,
	"telefono_alt"	INTEGER,
	"estado_civil"	TEXT CHECK("estado_civil" IN ("Soltero", "Casado")),
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
	FOREIGN KEY("usuario_id") REFERENCES "credenciales_usuario"("id"),
	FOREIGN KEY("datos_personales_id") REFERENCES "datos_personales"("id")
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
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("docente_id") REFERENCES "docente"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id")
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
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
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
DROP TABLE IF EXISTS "representante";
CREATE TABLE IF NOT EXISTS "representante" (
	"id"	INTEGER,
	"usuario_id"	INTEGER UNIQUE,
	"datos_personales_id"	INTEGER UNIQUE,
	"fecha_ingreso"	DATE NOT NULL,
	"trabajo"	TEXT,
	"lugar_trabajo"	TEXT,
	"activo"	INTEGER NOT NULL CHECK("activo" IN (0, 1)),
	FOREIGN KEY("datos_personales_id") REFERENCES "datos_personales"("id"),
	FOREIGN KEY("usuario_id") REFERENCES "credenciales_usuario"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "credenciales_usuario";
CREATE TABLE IF NOT EXISTS "credenciales_usuario" (
	"id"	INTEGER,
	"nombre_usuario"	TEXT,
	"clave_acceso"	TEXT,
	"activo"	INTEGER NOT NULL DEFAULT 0 CHECK("activo" IN (0, 1)),
	"tipo_usuario_id"	INTEGER,
	FOREIGN KEY("tipo_usuario_id") REFERENCES "tipo_usuario"("id"),
	PRIMARY KEY("id")
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
COMMIT;
