# stores-contact

Contact SignalStore + facade: inquiry submit via **Web3Forms** (errors toast via `shared-services`).

## Setup

1. Create a form at [web3forms.com](https://web3forms.com) with destination **vtsitlak@gmail.com**; copy the access key.
2. **GitHub Pages:** add repo/environment secret `WEB3FORMS_ACCESS_KEY` (written into `contact.web3forms.json` at deploy).
3. **Local:** copy the example and paste your key:

```sh
cp apps/neo-scout/public/contact.web3forms.example.json \
   apps/neo-scout/public/contact.web3forms.json
```

`contact.web3forms.json` is gitignored (same idea as the Scout API snapshot).

```sh
npx nx test stores-contact
```
