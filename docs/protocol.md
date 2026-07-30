# Persona audio installation protocol

This document describes the `ggwave` audio data transfer protocol that the OVOS Personas Marketplace uses.

## Opcode `P:U` (index shortcode)

This is the primary installation method. Instead of sending the full persona JSON, the marketplace sends the index of the persona in the `personas.jsonl` database.

- Format: `P:U{index}`
- Example: `P:U12`
- Data volume: low, because only the index travels over audio.

Mechanism:

1. The OVOS device receives the index over audio.
2. The OVOS GGWave skill fetches the latest `personas.jsonl` from the configured store URL.
3. The device extracts the persona at `{index}` and installs it.

## Installation process

When an OVOS device receives a persona over audio, it runs these steps:

1. **File creation**: the device creates a new JSON file at `~/.config/ovos_persona/{name}.json`.
2. **Dependency management**: the device requests installation, via `pip`, of any solver plugins listed under the `solvers` key.
3. **Activation acknowledgment**: if the persona definition has a `catch_phrase`, the device speaks it through TTS to confirm the install. If not, the device speaks a default confirmation.

---
[Home](../README.md)
