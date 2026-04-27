[CmdletBinding()]
param(
    [string]$RepoPath = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

Set-Location $RepoPath

$python = if (Test-Path ".\.venv\Scripts\python.exe") { ".\.venv\Scripts\python.exe" } else { "python" }

& $python -m pip install graphifyy code-review-graph
& $python -m graphify update .
& $python -X utf8 -m code_review_graph build

$copilotInstructions = @'
## graphify

Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` if it exists.
If `graphify-out/wiki/index.md` exists, navigate it for deep questions.
Type `/graphify` in Copilot Chat to build or update the knowledge graph.
When MCP servers are available, query `code-review-graph` and `graphify` first for repository questions.
Only fall back to broad file reads when graph results are missing or stale.
'@

$copilotPath = Join-Path $RepoPath '.github/copilot-instructions.md'
New-Item -ItemType Directory -Force -Path (Split-Path $copilotPath) | Out-Null
Set-Content -Path $copilotPath -Value $copilotInstructions -NoNewline

$mcpJson = @'
{
  "mcpServers": {
    "code-review-graph": {
      "command": "python",
      "args": ["-X", "utf8", "-m", "code_review_graph", "serve"],
      "type": "stdio"
    },
    "graphify": {
      "command": "python",
      "args": ["-X", "utf8", "-m", "graphify.serve", "graphify-out/graph.json"],
      "type": "stdio"
    }
  }
}
'@

Set-Content -Path (Join-Path $RepoPath '.mcp.json') -Value $mcpJson -NoNewline

$gitignorePath = Join-Path $RepoPath '.gitignore'
if (Test-Path $gitignorePath) {
    $gitignore = Get-Content $gitignorePath -Raw
    if ($gitignore -match '(?m)^graphify-out/\r?\n') {
        $gitignore = $gitignore -replace '(?m)^graphify-out/\r?\n', "graphify-out/cache/`r`n.code-review-graph/`r`n"
    }
    elseif ($gitignore -notmatch '(?m)^graphify-out/cache/\r?\n') {
        $gitignore = $gitignore.TrimEnd() + "`r`ngraphify-out/cache/`r`n.code-review-graph/`r`n"
    }
    Set-Content -Path $gitignorePath -Value $gitignore -NoNewline
}

Write-Host 'Graphify bootstrap complete.'