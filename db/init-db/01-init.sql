-- Создание таблицы film
CREATE TABLE IF NOT EXISTS "films" (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    tags JSONB,
    about TEXT NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    cover VARCHAR(255) NOT NULL
);

-- Создание таблицы schedule
CREATE TABLE IF NOT EXISTS "schedules" (
    id UUID PRIMARY KEY,
    daytime TIMESTAMP WITH TIME ZONE NOT NULL,
    hall INTEGER NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price INTEGER NOT NULL,
    taken TEXT NOT NULL,
    "filmId" UUID NOT NULL,
    CONSTRAINT fk_film
    FOREIGN KEY("filmId") 
    REFERENCES films(id)
    ON DELETE CASCADE
);


