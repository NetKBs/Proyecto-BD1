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
	FOREIGN KEY("docente_id") REFERENCES "docente"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("materia_id") REFERENCES "materia"("id")
);
CREATE TABLE IF NOT EXISTS "inscripcion_estudiante_anio" (
	"id"	INTEGER,
	"estudiante_id"	INTEGER NOT NULL,
	"periodo_id"	INTEGER NOT NULL,
	"anio"	INTEGER NOT NULL CHECK("anio" >= 1 AND "anio" IN (1, 2, 3, 4, 5)),
	"seccion"	TEXT NOT NULL,
	"aprobado"	INTEGER CHECK("aprobado" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id"),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id")
);
CREATE TABLE IF NOT EXISTS "representante_estudiante" (
	"id"	INTEGER,
	"representante_id"	INTEGER NOT NULL,
	"estudiante_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("representante_id") REFERENCES "representante"("id")
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
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id"),
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id")
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
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id"),
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id")
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
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("datos_personales_id") REFERENCES "persona"("id"),
	FOREIGN KEY("usuario_id") REFERENCES "usuario"("id")
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
	UNIQUE("periodo_id","seccion"),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id")
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
	FOREIGN KEY("materia_id") REFERENCES "materia"("id"),
	FOREIGN KEY("estudiante_id") REFERENCES "estudiante"("id"),
	FOREIGN KEY("periodo_id") REFERENCES "periodo_academico"("id")
);
COMMIT;
