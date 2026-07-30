# OVOS Personas Marketplace

The OVOS Personas Marketplace is a gallery of persona configurations for [OpenVoiceOS](https://openvoiceos.org). It offers over 50 ready-made personas that you can load into your [`ovos-persona`](https://github.com/OpenVoiceOS/ovos-persona) setup.

## Quick start

1. Open the marketplace page and browse the personas.
2. Click **PREVIEW** to view the raw JSON for a persona.
3. Click **COPY** to copy the persona configuration.
4. Click **AUDIO** to transmit the persona to a nearby OVOS device over sound. This needs [`ovos-skill-ggwave`](https://github.com/OpenVoiceOS/ovos-skill-ggwave) on the receiving device.
5. Say "Activate [Persona Name]" to your OVOS device.

## Audio installation protocol

The marketplace uses the Index-Based Shortcode Protocol (`P:U{index}`) to send a persona over audio. See [docs/protocol.md](docs/protocol.md) for the protocol details and how to build a receiver for it.

## Skins

The interface has four visual skins, available from the icons in the top-right corner:

- **Redline**: the default OVOS look. Bold and high-contrast.
- **Cyberpunk**: a neon interface.
- **Monochrome**: a minimal black-and-white interface.
- **Ghost**: a translucent purple interface.

## Add a persona

The marketplace reads its persona list from `personas.jsonl`. To add a persona:

1. Fork [this repository](https://github.com/TigreGotico/ovos-persona-marketplace).
2. Add your persona as a new line in `personas.jsonl`.
3. Commit your change, for example `feat: add Sherlock persona`.
4. Open a pull request against the `master` branch.
5. After the merge, the persona appears in the marketplace.

Example entry:
```json
{"name": "My Persona", "solvers": ["ovos-solver-openai-plugin", "ovos-solver-failure-plugin"], "description": "This is a great persona!"}
```

## License

Apache 2.0. Produced by Tigre Gótico Lda for the OpenVoiceOS ecosystem.
