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

## Opcode: `P:` (Direct Data)
Transmits the persona definition directly. Used for custom personas or when an internet connection is unavailable for the receiver (but direct data transfer is still needed).

### Sub-format: Raw JSON
- **Format**: `P:{json_string}`
- **Example**: `P:{"name":"Mini","solvers":["ovos-solver-openai-plugin"]}`
- **Reliability**: Medium (High data volume)

### Sub-format: Gzipped Base64
- **Format**: `P:Z{base64_encoded_gzip}`
- **Reliability**: Medium-High (Compressed data volume)
- **Mechanism**: Data is compressed using Gzip, encoded to Base64, and prefixed with `P:Z`.

## Installation Process
When an OVOS device receives a persona via audio:
1. **File Creation**: A new JSON file is created in `~/.config/ovos_persona/{name}.json`.
2. **Dependency Management**: Any required solver plugins listed in the `solvers` key are automatically requested for installation via `pip`.
3. **Activation**: The persona becomes immediately available for activation via voice ("Activate {name}").
