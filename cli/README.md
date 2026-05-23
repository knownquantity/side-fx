# side-effects

CLI for the [Side Effects](https://github.com/knownquantity/side-effects) newsletter.

> SFX of an agentic internet.

## Use

```sh
npx @knownquantity/side-effects                 # help
npx @knownquantity/side-effects subscribe       # subscribe via email
npx @knownquantity/side-effects latest          # the 3 most recent issues
npx @knownquantity/side-effects read 001        # read an issue in your terminal
npx @knownquantity/side-effects api             # show the JSON endpoints
```

Requires Node 18+.

## Subscribing

`subscribe` posts to a small Vercel function that proxies to Buttondown. No API key lives in this package. If the proxy is unreachable, the command falls back to printing the public subscribe URL.

## License

MIT.
