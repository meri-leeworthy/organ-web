# Organ Web

Organ is a decentralised platform for grassroots organising in development by [Radical Directory](https://radical.directory). This repo is the source code for the web app which is live at [organ.is](organ.is).

Organ is essentially a client to the [Matrix](https://matrix.org) protocol extended with some custom events which describe calendar events, social media-style posts, and more.

As this project develops, the intention is to formalise and standardise these extensions to the specification, in support of the Matrix vision of an interoperable, open communications network. This repo uses [`simple-matrix-sdk`](https://github.com/meri-leeworthy/simple-matrix-sdk) to interact with the Matrix server.

Organ Web is a [Next.js](https://nextjs.org/) project using Typescript and Tailwind CSS. Next.js is a full-stack application framework based around React.

## Getting Started

``` sh
# setup environment variables
cp .env.local.example .env.local

# generate a configuration file in the 'synapse-data' volume
docker-compose run --rm synapse generate

# run a setup script for appservice configuration
docker run --rm -v organ-web_synapse-data:/data -v $(pwd)/synapse:/as alpine /bin/sh -c "chmod +x /as/setup.sh && /as/setup.sh"

# start synapse
docker-compose up -d

# register a new user
docker exec -it organ-web-synapse-1 register_new_matrix_user http://localhost:8008 -c /data/homeserver.yaml

# synapse should be accessible at localhost:8008

# install dependencies
pnpm install

# run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

As well as being a Matrix client, Organ Web also operates as an [Application Service](https://spec.matrix.org/v1.9/application-service-api/), which is like a client which has been configured on a server to have special permissions. The live app is configured as an application service for the [radical.directory](https://element.radical.directory) Matrix server. This enables the server-side Next.js code to authenticate with an App Service Token (`AS_TOKEN` environment variable) rather than logging in and using normal access tokens. App Services can act as a client for users on the server which have a certain prefix on their user ID. In this case the prefix is `_relay_`. User accounts with that prefix can then operate as 'relays' to the web app server.

## Seed Data

For development purposes, you can seed the database with some test data. This can be done via a web interface at `/as`. At the top of the page there is a button 'Seed All'. The steps can also be run individually. Seeding is not idempotent so it is recommended to clear the database before seeding to avoid duplication.

``` sh
# reset synapse container and volume
./synapse/reset.sh
```
