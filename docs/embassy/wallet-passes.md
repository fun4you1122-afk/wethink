# Wallet passes for the Opening Ceremony

The invitation issues each guest a ticket with a QR code, and offers to save it
to Apple Wallet and Google Wallet. Everything is built; the two wallets are
waiting on credentials, and each half goes live on its own as soon as its
variables are set in Vercel. Until then the ticket and its QR code work as they
are, and the buttons simply do not appear.

Nothing about a guest is stored. The reference on a ticket is derived from the
guest's name, so the same guest always gets the same reference without us
keeping a record of anyone.

## What the guest sees

They open their invitation, confirm attendance, and the ticket appears with
their name, a six character reference, and a QR code. The QR opens their own
copy of the invitation, so a phone with no scanner app still does something
sensible with it. WeThink is named on the ticket, on the pass, and as the pass
issuer in both wallets.

## Apple Wallet

Needs a paid Apple Developer Program membership. From
<https://developer.apple.com/account>:

1. Certificates, Identifiers & Profiles ▸ Identifiers ▸ **+** ▸ Pass Type IDs.
   Create `pass.ae.wethink.marhaba`.
2. On that identifier, create a **Pass Type ID Certificate**. You will upload a
   certificate signing request, which Keychain Access on a Mac produces under
   Certificate Assistant ▸ Request a Certificate from a Certificate Authority.
3. Download the resulting `.cer`, open it in Keychain Access, and export the
   certificate and its private key as separate PEM files.
4. Download the **Apple Worldwide Developer Relations** intermediate
   certificate (G4) from <https://www.apple.com/certificateauthority/> and
   convert it to PEM.

Then set these in Vercel ▸ Project ▸ Settings ▸ Environment Variables. The three
certificate values are the PEM files base64 encoded, which keeps their newlines
intact:

| Variable | Value |
| --- | --- |
| `APPLE_PASS_TYPE_ID` | `pass.ae.wethink.marhaba` |
| `APPLE_TEAM_ID` | the ten character team identifier |
| `APPLE_PASS_SIGNER_CERT` | signer certificate PEM, base64 |
| `APPLE_PASS_SIGNER_KEY` | signer private key PEM, base64 |
| `APPLE_PASS_SIGNER_PASSWORD` | passphrase on the key, if you set one |
| `APPLE_WWDR_CERT` | WWDR intermediate PEM, base64 |

To base64 a file: `base64 -w0 signer.pem` on Linux, or `base64 -i signer.pem`
on a Mac.

## Google Wallet

Free, but the issuer account has to be approved before passes work for the
public. Start this early.

1. Google Pay & Wallet Console, <https://pay.google.com/business/console>.
   Create an issuer account and note the **Issuer ID**.
2. Request publishing access for the issuer. Until it is granted, only accounts
   you add to the test list can save a pass.
3. Google Cloud Console: create a project, enable the **Google Wallet API**,
   create a service account, and download its JSON key.
4. Back in the Wallet Console, authorise that service account email as an issuer
   user.

| Variable | Value |
| --- | --- |
| `GOOGLE_WALLET_ISSUER_ID` | the issuer ID, a long number |
| `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON key |
| `GOOGLE_WALLET_PRIVATE_KEY` | `private_key` from the JSON key, newlines as `\n` is fine |

The pass class is created from the signed link itself, so there is no separate
setup step and nothing to keep in sync.

## Checking it worked

`https://www.wethink.ae/api/wallet/status` reports which halves are live:

```json
{ "apple": true, "google": true }
```

The buttons appear on the ticket as soon as that flips.

## Before sending to guests

Apple and Google both publish official "Add to Apple Wallet" and "Save to
Google Wallet" badge artwork, with rules about size and clear space. The
buttons currently use our own styling. Swap in the official badges from
<https://developer.apple.com/wallet/> and
<https://developers.google.com/wallet/generic/resources/brand-guidelines>
before this goes out widely.

## Emails

Confirmation and reminder emails are handled separately, from the Embassy's own
Google account, so they send from the Embassy's address and guest details never
leave their Workspace. See `reminder-emails.gs` in this folder.
