CREATE DATABASE yala;

USE yala;

CREATE TABLE FichasBibliograficas (
    IdFicha INT IDENTITY(1,1) PRIMARY KEY,
    TipoDocumento VARCHAR(50) NOT NULL CHECK (TipoDocumento IN ('libro', 'articulo', 'tesis', 'video', 'periodico', 'repositorio')),
    Autor NVARCHAR(255) NOT NULL,
    Titulo NVARCHAR(255) NOT NULL,
    AnioPublicacion INT CHECK (AnioPublicacion <= YEAR(GETDATE())),
    Editorial NVARCHAR(255), -- Solo si aplica
    NumeroEdicion NVARCHAR(50),
    NumeroPaginas INT CHECK (NumeroPaginas IS NULL OR NumeroPaginas > 0),
    Tema NVARCHAR(255) NOT NULL,
    FechaAgregada DATE NOT NULL DEFAULT GETDATE(), -- Fecha automática
    Estado BIT DEFAULT 1 -- Estado automático (activo)
);

SELECT * FROM FichasBibliograficas;
SELECT * FROM FichasBibliograficas WHERE IdFicha = 4;

-- Realizar un eliminado lógico: cambiar el estado a 0 (inactivo) para la ficha con IdFicha = 4
UPDATE FichasBibliograficas
SET
    Autor = 'pepe' -- Cambia el estado a inactivo
WHERE
    IdFicha = 3; -- Condición para seleccionar el registro específico




-- 1. Libro
INSERT INTO FichasBibliograficas (
    TipoDocumento, Autor, Titulo, AnioPublicacion, Editorial, NumeroEdicion, NumeroPaginas, Tema
) VALUES (
    'libro', 'Alonso Cueto', 'La hora azul', 2005, 'Planeta', '1ra', 256, 'Narrativa peruana'
);

-- 2. Artículo
INSERT INTO FichasBibliograficas (
    TipoDocumento, Autor, Titulo, AnioPublicacion, Editorial, NumeroEdicion, NumeroPaginas, Tema
) VALUES (
    'articulo', 'María López', 'Perspectivas de la literatura moderna', 2021, 'Revista Letras', '3ra', 15, 'Literatura contemporánea'
);

-- 3. Tesis
INSERT INTO FichasBibliograficas (
    TipoDocumento, Autor, Titulo, AnioPublicacion, Editorial, NumeroEdicion, NumeroPaginas, Tema
) VALUES (
    'tesis', 'Juan Torres', 'Influencia del boom latinoamericano', 2019, 'UNMSM', '1ra', 140, 'Literatura hispanoamericana'
);

-- 4. Video (campos limitados)
INSERT INTO FichasBibliograficas (
    TipoDocumento, Autor, Titulo, AnioPublicacion, Tema
) VALUES (
    'video', 'César Vallejo', 'Poética y sociedad', 2023, 'Poesía social'
);

-- 5. Repositorio universitario
INSERT INTO FichasBibliograficas (
    TipoDocumento, Autor, Titulo, AnioPublicacion, Tema
) VALUES (
    'repositorio', 'Lucía Méndez', 'Estudios de narrativa breve', 2022, 'Narrativa breve peruana'
);


SELECT * FROM FichasBibliograficas;
