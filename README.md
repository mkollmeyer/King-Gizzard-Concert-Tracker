# King Gizzard Setlist Tracker
This is a web app built to track the songs you have seen live as well as the cities you have seen them in.

## Accessing the website
You can access the website by going to [kinggizzardtracker.net](https://kinggizzardtracker.net) and accessing it that way.

## Tech stack
The frontend was built in vue and typescript for the interface. The backend was built in python using fastAPI as a framework, and mongoDB as the database.

## Running with Docker Compose
Set the Compose interpolation variables in the root `.env` file, and set `API_KEY` in `server/.env`. From the repository root, run:

```sh
docker compose --env-file .env up --build
```

The root `.env` supplies values referenced with `${...}` in `docker-compose.yml`. A service's `env_file` only supplies variables inside that container.

The frontend sends API requests to the same origin; the production Nginx container forwards `/api` requests to the backend over the Compose network.

## Coming soon
My next plans are to add a system so that users can add their friends and show off their stats to their freinds!
