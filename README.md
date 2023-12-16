# Organ Web

Organ is a decentralised platform for grassroots organising in development by [Radical Directory](https://radical.directory). This repo is the source code for the web app which is live at [organ.is](organ.is).

Organ is essentially a client to the [Matrix](https://matrix.org) protocol extended with some custom events which describe calendar events, social media-style posts, and more.

As this project develops, the intention is to formalise and standardise these extensions to the specification, in support of the Matrix vision of an interoperable, open communications network. This repo uses [`simple-matrix-sdk`](https://github.com/meri-leeworthy/simple-matrix-sdk) to interact with the Matrix server.

Organ Web is a [Next.js](https://nextjs.org/) project using Typescript and Tailwind CSS. Next.js is a full-stack application framework based around React.

## Getting Started

This repo won't run very well by itself. As well as being a Matrix client, Organ Web also operates as an [Application Service](https://spec.matrix.org/v1.9/application-service-api/), which is like a client which has been configured on a server to have special permissions. The live app is configured as an application service for the [radical.directory](https://element.radical.directory) Matrix server. This enables the server-side Next.js code to authenticate with an App Service Token (`AS_TOKEN` environment variable) rather than logging in and using normal access tokens. App Services can act as a client for users on the server which have a certain prefix on their user ID. In this case the prefix is `_relay_`. User accounts with that prefix can then operate as 'relays' to the web app server.

Due to these interdependencies, there is not currently a straightforward way to setup a self-contained dev environment. Ultimately, it would be good to have a simple docker-compose setup for Synapse (with the App Service configuration) for running a local dev server alongside this Next.js server.

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

