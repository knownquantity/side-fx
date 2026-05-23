# side-effects-mag

CLI for [Side Effects Magazine](https://github.com/knownquantity/side-effects-mag).

> The SFX of progress.

## Use

```sh
npx side-effects-mag                 # help
npx side-effects-mag subscribe       # subscribe via email
npx side-effects-mag latest          # the 3 most recent issues
npx side-effects-mag read 001        # read an issue in your terminal
npx side-effects-mag api             # show the JSON endpoints
```

Requires Node 18+.

## Subscribing

`subscribe` posts to a small Vercel function that proxies to Buttondown. No API key lives in this package. If the proxy is unreachable, the command falls back to printing the public subscribe URL.

## License

MIT.
