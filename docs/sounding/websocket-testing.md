---
title: Websocket Testing
editLink: true
---

# Websocket testing

Sounding can test Sails websocket behavior without making you write raw Socket.IO ceremony.

Use it when the contract is:

- a Sails socket request
- a room join or leave
- a broadcast from `sails.sockets`
- realtime API behavior that does not need the browser UI

Use [browser testing](/sounding/browser-testing) when the contract is the actual client experience, such as canvas rendering, keyboard controls, drag behavior, or the game client running in a real tab.

## A room broadcast trial

Opt into a socket-capable trial with `{ socket: true }`, then connect one or more sockets.

```js
const { test } = require('sounding')

test(
  'players in the arena receive chat messages',
  { socket: true },
  async ({ sockets, expect }) => {
    const member = await sockets.connect()
    const speaker = await sockets.connect()

    await member.post('/api/rooms/join', {
      room: 'arena'
    })

    const nextMessage = expect(member).toReceive('chat:message', {
      room: 'arena',
      text: 'ready'
    })

    await speaker.post('/api/rooms/message', {
      room: 'arena',
      text: 'ready'
    })

    await nextMessage
  }
)
```

The trial is still exercising real Sails websocket behavior:

- the app is lifted with the HTTP hook
- the connection goes through Socket.IO
- Sails receives the request with `req.isSocket`
- `req.socket` is available
- `req.session` is backed by Sails session handling
- `sails.sockets.join()` and `sails.sockets.broadcast()` are the real APIs

## Socket manager

The trial context exposes `sockets`.

```js
const socket = await sockets.connect()
```

You can also access the same manager from the runtime:

```js
const socket = await sails.sounding.sockets.connect()
```

The manager exposes:

- `sockets.connect(options?)`
- `sockets.as(actor).connect(options?)`
- `sockets.closeAll()`

Sounding closes open sockets when the runtime lowers, so a trial does not leave realtime clients connected after cleanup.

## Socket client methods

Each connected socket exposes HTTP-shaped request helpers:

- `socket.request(method, target, payloadOrOptions?, options?)`
- `socket.get(target, options?)`
- `socket.head(target, options?)`
- `socket.post(target, payload, options?)`
- `socket.put(target, payload, options?)`
- `socket.patch(target, payload, options?)`
- `socket.delete(target, payload, options?)`

These methods send Sails socket requests, so route handlers see socket-specific request state.

```js
const response = await socket.get('/api/socket-health')

expect(response).toHaveStatus(200)
expect(response).toHaveJsonPath('isSocket', true)
```

Responses use Sounding's normal response shape:

- `response.status`
- `response.ok`
- `response.headers`
- `response.body`
- `response.data`
- `response.json()`
- `response.text()`

## Receiving events

Use `socket.receive(eventName)` when you want the payload directly.

```js
const payload = await member.receive('game:tick')

expect(payload).toEqual({
  phase: 'combat',
  turn: 12
})
```

`receive()` waits for the named event and resolves with the event payload.
If the event was already received and has not been consumed, Sounding returns the buffered payload.

You can pass a timeout:

```js
const payload = await member.receive('match:started', {
  timeout: 500
})
```

## Event assertions

Use `toReceive()` for the common assertion style.

```js
await expect(member).toReceive('chat:message', {
  text: 'hello'
})
```

The expected payload is a partial match. This keeps realtime tests pleasant when your events also include IDs, timestamps, or derived fields.

```js
await expect(member).toReceive('match:scoreboard', {
  players: [
    {
      handle: 'ada'
    }
  ]
})
```

Use `toHaveReceived()` when the event may already be in the socket history.

```js
expect(member).toHaveReceived('chat:message', {
  text: 'hello'
})
```

Use `not.toReceive()` for absence checks with a short timeout.

```js
await expect(spectator).not.toReceive('private:hand', undefined, {
  timeout: 100
})
```

## Actor sockets

Use `sockets.as(actor).connect()` when the socket should start as an actor from your world.

```js
test(
  'the active player can ask for their private match state',
  { socket: true, world: 'match-in-progress' },
  async ({ sockets, expect }) => {
    const player = await sockets.as('playerOne').connect()

    const response = await player.get('/api/matches/current/private-state')

    expect(response).toHaveStatus(200)
  }
)
```

If you pass a string, Sounding looks in the current world using your auth collection.

```js
const player = await sockets.as('playerOne').connect()
```

For session-based Sails apps, Sounding creates a Sails session cookie from the actor session data before connecting.
For token-based apps, put headers on the actor:

```js
const apiClient = await sockets
  .as({
    sounding: {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
  })
  .connect()
```

You can also log in through your app's real socket route when that is the behavior you want to prove.

```js
const player = await sockets.connect()

await player.post('/login', {
  email: 'player@example.com',
  password: 'secret'
})

const dashboard = await player.get('/dashboard')
expect(dashboard).toHaveStatus(200)
```

## Configuration

Most apps do not need socket config.

When you do, add a `sockets` section to `config/sounding.js`:

```js
module.exports.sounding = {
  sockets: {
    timeout: 1000,
    transports: ['websocket'],
    path: '/socket.io',
    headers: {},
    initialConnectionHeaders: {}
  }
}
```

Available options:

- `enabled`
- `timeout`
- `transports`
- `path`
- `baseUrl`
- `headers`
- `initialConnectionHeaders`

Use `baseUrl` when the socket server is not the lifted Sails server Sounding can discover automatically.

Use `initialConnectionHeaders` for handshake headers such as cookies or origin-sensitive tests.
Use `headers` for headers sent with each Sails socket request.

## When to reach for this

Socket trials are great for lightweight realtime API coverage:

- a player joins a room
- a server action broadcasts a match update
- a spectator does not receive private player state
- a socket request shares session state across multiple socket requests
- a realtime endpoint still returns the expected JSON response

Browser trials are still the better fit when you need the actual client runtime.
For a game, a healthy suite often has both: socket trials for fast protocol coverage, and a smaller number of Playwright trials for the real player experience.
