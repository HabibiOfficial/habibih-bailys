# Baileys Clean Fork

Fork bersih dari Baileys (basis: `ItsukiChan/Baileys`) — semua fitur original lengkap, **tanpa backdoor dan tanpa auto-follow tersembunyi**.

## Yang Dihapus dari Fork Aslinya

| File/Fungsi | Keterangan |
|---|---|
| `lib/Socket/autoFollowChannels.js` | ❌ Dihapus — file backdoor utama |
| `newsletterAutoFollowSilent` | ❌ Dihapus — fungsi auto-follow diam-diam |
| `https://id-channel.vercel.app/api/channels` | ❌ Tidak ada koneksi ke server orang lain |

## Install

```bash
npm install
# atau
yarn
```

Atau pakai dari GitHub:

```bash
npm install github:username/repo-kamu
```

## Cara Pakai

```js
const makeWASocket = require('./lib/Socket/index').default
const { useMultiFileAuthState, DisconnectReason } = require('./lib/index')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('✅ Bot konek!')
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) startBot()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.key.fromMe) {
      console.log('📨 Pesan masuk:', msg.message)
    }
  })
}

startBot()
```

## Auto-Follow Saluran Owner (Transparan)

Berbeda dengan fork aslinya yang diam-diam, fungsi ini **dipanggil secara eksplisit** dan channel ID-nya **terlihat langsung di kode**:

```js
sock.ev.on('connection.update', async ({ connection }) => {
  if (connection === 'open') {
    // Panggil secara eksplisit — tidak jalan otomatis diam-diam
    await sock.autoFollowOwnerChannels(true)
  }
})
```

Saluran yang akan di-follow:
- `120363421412174731@newsletter`
- `120363406225530257@newsletter`
- `120363419318051000@newsletter`
- `120363408101167880@newsletter`

> Untuk menonaktifkan, cukup kirim `false`: `autoFollowOwnerChannels(false)`

---

## Fitur Newsletter / Saluran

```js
// Follow channel
await sock.newsletterFollow('120363xxxxxx@newsletter')

// Unfollow channel
await sock.newsletterUnfollow('120363xxxxxx@newsletter')

// Mute / Unmute notifikasi
await sock.newsletterMute('120363xxxxxx@newsletter')
await sock.newsletterUnmute('120363xxxxxx@newsletter')

// Ambil metadata channel
const meta = await sock.newsletterMetadata('invite', 'link-invite', 'GUEST')

// Buat channel baru
const channel = await sock.newsletterCreate('Nama Channel', 'Deskripsi')
```

## Fitur Buttons / Pesan Interaktif

```js
// Button biasa
await sock.sendMessage(jid, {
  text: 'Pilih salah satu:',
  buttons: [
    { buttonId: 'btn1', buttonText: { displayText: 'Opsi 1' }, type: 1 },
    { buttonId: 'btn2', buttonText: { displayText: 'Opsi 2' }, type: 1 },
  ],
  headerType: 1
})

// List message
await sock.sendMessage(jid, {
  text: 'Pilih menu:',
  footer: 'Footer bot',
  title: 'Judul',
  buttonText: 'Buka Menu',
  sections: [
    {
      title: 'Section 1',
      rows: [
        { title: 'Item 1', rowId: 'item1', description: 'Deskripsi' },
      ]
    }
  ]
})
```

## License

MIT
