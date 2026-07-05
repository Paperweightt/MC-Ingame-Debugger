set windows-shell := ["powershell.exe", "-NoProfile", "/c"]

prettier := ".\\node_modules\\.bin\\prettier.cmd"

mojang := env_var("USERPROFILE")+"/AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
mojang_bp := mojang + "/development_behavior_packs/Ingame Debugger_26914881-c5f1-4c85-9b41-208d70df47a4"

bump TYPE:
    mcbe bump \
    -p ./behavior_packs/pack0/manifest.json \
    -t {{ TYPE }}
    {{prettier}} --write .\behavior_packs\pack0\manifest.json

build:
    node esbuild.config.mjs

build-watch:
    node esbuild.config.mjs --watch

link:
    mcbe link \
    -i ./behavior_packs/pack0 \
    -o "{{mojang_bp}}"

unlink:
    mcbe unlink "{{mojang_bp}}"

mcaddon:
    Compress-Archive \
    -Path "./behavior_packs/pack0", \
    -DestinationPath "./dist/Ingame Debugger.mcaddon" \
    -CompressionLevel "Optimal" \
    -Force
    
