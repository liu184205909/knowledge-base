# RankerX unattended launcher v2 (2026-09-10)
# Flow: check panel -> start exe -> auto-click login dialog (ENTER) -> wait panel ready
# NOTE: does NOT rewrite rankerx.json (PowerShell json rewrite breaks launch4j format)
param([switch]$ShowConsole)
$RKX_DIR = Join-Path $env:LOCALAPPDATA 'RankerX'
$RKX_EXE = Join-Path $RKX_DIR 'rankerx.exe'

function Test-Panel {
  try { (Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing -TimeoutSec 4).StatusCode -eq 200 } catch { $false }
}

if (Test-Panel) { Write-Output '[rkx] already running, exit'; exit 0 }

Start-Process $RKX_EXE -WorkingDirectory $RKX_DIR
Write-Output '[rkx] started, waiting for login dialog...'

Add-Type -AssemblyName System.Windows.Forms
$ws = New-Object -ComObject WScript.Shell
$entered = 0
foreach ($i in 1..40) {
  Start-Sleep -Seconds 2
  if (Test-Panel) { break }
  if ($ws.AppActivate('RankerX') -and $entered -lt 3) {
    Start-Sleep -Milliseconds 800
    [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
    $entered++
    Write-Output ("[rkx] login ENTER #" + $entered)
  }
}
foreach ($i in 1..24) {
  if (Test-Panel) { Write-Output '[rkx] panel ready: http://localhost:8080'; exit 0 }
  Start-Sleep -Seconds 5
}
Write-Output '[rkx] TIMEOUT (login may need manual click)'; exit 1
