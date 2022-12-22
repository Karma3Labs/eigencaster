Eigencaster is a frontend that
accepts a Farcaster user (address) and
displays casts by people not already followed by the given user,
using the EigenTrust algorithm to determine the people to display.

Eigencaster is based on
[Searchcaster](https://github.com/gskril/searchcaster).

## Set up an all-in-one local environment

### Run a local PostgreSQL server with Farcaster crawled data

#### Using Docker (recommended)

Simply run:

```sh
docker run --name farcaster_db -p 5432:5432 -d karma3labs/farcaster_db
```

This image includes Farcaster data, so no crawling is needed.  Image is updated every night.

#### Using DB dump

Ensure a local PostgreSQL server is running, then restore from a nightly DB dump.  **TBD**

### Install other prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Go](https://go.dev/dl/)

### Run go-eigentrust
[go-eigentrust](https://github.com/Karma3Labs/go-eigentrust) is the EigenTrust algorithm and API implementation.  We will run its self-hosted API server:

```sh
go run k3l.io/go-eigentrust/cmd/eigentrust@latest serve --listen_address :8081
```

### Run ts-farcaster

[ts-farcaster](https://github.com/Karma3Labs/ts-farcaster) is a Farcaster-specific EigenTrust backend.

Clone and chdir into the repo:

```sh
git clone -o Karma3Labs --no-tags https://github.com/Karma3Labs/ts-farcaster.git
cd ts-farcaster
```

Configure ts-farcaster:

```sh
cp .env.template .env
vim .env  # customize DB params
```

Install/update dependencies:

```sh
yarn
```

Build everything (do this again after changing code):

```sh
yarn build
```

**If running DB with Docker as above, or if the local database is otherwise populated already, skip this.**  Otherwise, initialize and populate the database:

```sh
createdb farcaster
npx knex migrate:up 
yarn scrape
```

Run the service:

```sh
yarn serve
```

### Run Eigencaster (this repo):

Clone and chdir into the repo:

```sh
git clone -o Karma3Labs --no-tags https://github.com/Karma3Labs/eigencaster.git
cd eigencaster
```

Install/update dependencies:

```sh
yarn
```

Configure:

```sh
cp .env.example .env
vim .env  # ensure API_URL=http://localhost:8080 is there
```

Start the UI server and render the UI:

```sh
yarn dev
```

Visit the Eigencaster frontend at http://localhost:3000/.
