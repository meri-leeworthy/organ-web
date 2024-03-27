docker compose down
docker volume rm organ-web_synapse-data
docker compose run --rm synapse generate
docker run --rm -v organ-web_synapse-data:/data -v $(pwd)/synapse:/as alpine /bin/sh -c "chmod +x /as/setup.sh && /as/setup.sh"
docker compose up -d
docker exec -it organ-web-synapse-1 register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml
pnpm dev