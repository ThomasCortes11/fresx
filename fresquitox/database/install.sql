-- Instalación completa Fresquitox DB
-- Uso: psql -d fresquitox -f install.sql

\echo '>>> Creando esquema...'
\i schema.sql

\echo '>>> Insertando datos iniciales...'
\i seed.sql

\echo '>>> Creando vistas de reportes...'
\i views_reportes.sql

\echo '>>> Fresquitox DB lista.'
