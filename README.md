# CASA-TypeScript
CASA project with TypeScript

## How to Run
Pull the repo, call `npm i` and then `npm start`. In your browser open `localhost:3000/start`.

There are 2 identical journeys, `authenticated` and `unauthenticated`. Navigating to either one will generate a session and log the session id to the terminal. 

To delete the session, do a GET request to `/destroy?sid=${sessionId}&store=${authenticated/unauthenticated}`
To navigate the user to the `You've been logged out` screen, do a GET request to `/message?message=logout`

TODO: further work is needed to redirect a specific user - right now it logs out and redirects all users.

## How it Works 
Destroying a session calls the `sessionStore.destroy` method, which accepts a session id. 

Navigating a user to the `You've been logged out` screen is done with [Server-Side-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

## Things to Consider
Server-Side-Events have certain limitations, like the number of connections limited to 6 per browser when not using HTTP 2. 

This approach is stateful - array of `Client`s is stored in memory (`server.ts` line 40). It can be persisted in a database, but that would have its own implications - more things to store, higher usage costs and potentially reduction in responsiveness. 

