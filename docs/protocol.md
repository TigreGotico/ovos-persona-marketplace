# Persona Audio Installation Protocol

This document describes the `ggwave` based audible data transfer protocol used by the OVOS Personas Marketplace.

## Opcode: `P:U` (Index Shortcode)
The primary and most reliable method for installation. Instead of transmitting the entire JSON, it transmits the index of the persona in the official `personas.jsonl` database.

- **Format**: `P:U{index}`
- **Example**: `P:U12`
- **Reliability**: Extremely High (Low data volume)
- **Mechanism**:
    1. OVOS device receives the index.
    2. OVOS GGWave Skill fetches the latest `personas.jsonl` from the configured store URL.
    3. The persona at `{index}` is extracted and installed.

## Installation Process
When an OVOS device receives a persona via audio:
1. **File Creation**: A new JSON file is created in `~/.config/ovos_persona/{name}.json`.
2. **Dependency Management**: Any required solver plugins listed in the `solvers` key are automatically requested for installation via `pip`.
3. **Activation Acknowledgment**: If the persona definition includes a `catch_phrase`, the device will speak it immediately via TTS to confirm successful installation. Otherwise, a default confirmation is spoken.
