# Google Sheets bridge

Lets Claude Code read and write **My Claude Budget** directly, so budgeting and
logging happen in conversation and the sheet updates itself.

Sheet: https://docs.google.com/spreadsheets/d/1BrM8jAJC8Wuqm6WWZnu9jocdeNfxr4rYngapAXTXWMI/edit

## Why a web app and not the Sheets API

The Google Drive connector Claude has can *read* a spreadsheet but cannot write a
single cell. The Sheets API proper needs a Google Cloud project, an OAuth consent
screen and a credentials file. An Apps Script bound to the sheet needs none of
that: it lives inside the sheet Samuel already owns, and it is one paste and one
deploy, once, forever.

## Setup — done once, ~4 minutes

1. Open the sheet.
2. **Extensions → Apps Script.**
3. Delete whatever is in `Code.gs` and paste. Save (Ctrl+S).

   Get the script onto the clipboard with the real token already substituted in —
   the committed `Code.gs` carries a `__SHEETS_TOKEN__` placeholder so the secret
   never enters git history:

   ```powershell
   python tools/sheets/sheets.py script | Set-Clipboard
   ```

4. **Deploy → New deployment.** Gear icon → **Web app**.
   - Description: `engine bridge`
   - Execute as: **Me (repzysam@gmail.com)**
   - Who has access: **Anyone**
5. **Deploy.** Google asks to authorise — Review permissions → pick the account →
   "Google hasn't verified this app" → **Advanced → Go to (project name)** →
   **Allow**. That warning is normal: the unverified app is the script Samuel just
   wrote himself.
6. Copy the **Web app URL** (ends in `/exec`) and give it to Claude Code.

Claude then writes `.env` at the repo root:

```
SHEETS_WEBAPP_URL=https://script.google.com/macros/s/AKfy.../exec
SHEETS_TOKEN=<the shared secret Claude generates - real value lives only in .env>
SHEETS_ID=1BrM8jAJC8Wuqm6WWZnu9jocdeNfxr4rYngapAXTXWMI
```

`.env` is gitignored. It never gets committed.

Verify:

```bash
python tools/sheets/sheets.py ping
```

## If the script ever changes

Editing `Code.gs` in the Apps Script editor is not enough — **Deploy → Manage
deployments → edit (pencil) → Version: New version → Deploy.** The `/exec` URL
stays the same. But the script is deliberately generic, so this should never be
needed: the budget gets redesigned through `ops`, not through new script code.

## Security, plainly

"Who has access: Anyone" means anyone who has the URL can POST to it. The `TOKEN`
in the script is what actually stops them — requests without it are rejected. So:
the web app URL and the token are a password. Do not paste them into a chat, an
issue, or a screenshot. If either leaks, change `TOKEN` in the script, redeploy a
new version, and update `.env`.

The script can only touch this one spreadsheet. It has no access to the rest of
Drive, Gmail, or anything else.

## Using it

`ops` is the real interface — a JSON list of operations run in order, in one
request:

```bash
python tools/sheets/sheets.py ops payload.json
```

```json
{"ops": [
  {"action": "ensureSheet", "args": {"tab": "Details"}},
  {"action": "write", "args": {"tab": "Details", "cell": "A1",
    "values": [["Category", "Item", "Amount"]]}},
  {"action": "format", "args": {"tab": "Details", "range": "A1:C1",
    "bold": true, "background": "#1f2937", "fontColor": "#ffffff"}}
]}
```

Actions: `ping` `read` `readRaw` `readFormulas` `find` `write` `append`
`setFormulas` `clear` `ensureSheet` `deleteSheet` `renameSheet` `insertRows`
`deleteRows` `insertColumns` `setColumnWidth` `setRowHeight` `freeze` `format`
`note` `validation` `clearValidation`.

## Remote / phone

Cloud routines run from the repo, and `.env` is not in the repo, so a cloud
session cannot write to the sheet until `SHEETS_WEBAPP_URL` and `SHEETS_TOKEN`
are set as environment variables there. Until that is done, remote check-ins
still write `context/money-ledger.md` as normal — the ledger stays the source of
truth (money.md Rule 6) and the sheet catches up at the next desktop session.
