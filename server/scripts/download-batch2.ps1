param(
    [int]$MaxDownloads = 20,
    [int]$DelaySeconds = 15
)

$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"
$senalesDir = "server\public\senales"
$progressFile = "server\scripts\download-progress.json"

# Load progress
$done = @{}
if (Test-Path $progressFile) {
    $done = Get-Content $progressFile | ConvertFrom-Json -AsHashtable
}

# Read the URLs from commons-urls.json
$urlsData = Get-Content "server\scripts\commons-urls.json" | ConvertFrom-Json -AsHashtable

# Filter to only official code-named files (r*, p*, s*)
$targets = $urlsData.Keys | Where-Object { $_ -match '^[rps]\d' } | Sort-Object

# Filter out already downloaded
$toDownload = $targets | Where-Object { -not $done.ContainsKey($_) -and -not (Test-Path "$senalesDir\$_.svg") }

Write-Output "Need to download: $($toDownload.Count) files"
Write-Output "Already done: $($done.Count) files"

$count = 0
foreach ($code in $toDownload) {
    if ($count -ge $MaxDownloads) { break }

    $url = $urlsData[$code]
    $outFile = "$senalesDir\$code.svg"

    Write-Output "Downloading $code..."

    try {
        $response = Invoke-WebRequest -Uri $url -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -TimeoutSec 30 -OutFile $outFile

        $fileInfo = Get-Item $outFile
        if ($fileInfo.Length -gt 100) {
            # Check if it's a valid PNG (starts with magic bytes)
            $bytes = Get-Content $outFile -Encoding Byte -TotalCount 8
            $isPng = ($bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47)
            $isSvg = $bytes[0] -eq 0x3C  # <

            if ($isPng -or $isSvg) {
                Write-Output "  OK: $($fileInfo.Length) bytes (PNG)"
                $done[$code] = $true
                $count++
            } else {
                Write-Output "  FAIL: Not PNG or SVG (corrupt/429 page)"
                Remove-Item $outFile -Force
            }
        } else {
            Write-Output "  FAIL: Too small ($($fileInfo.Length) bytes)"
            Remove-Item $outFile -Force
        }
    } catch {
        Write-Output "  ERROR: $($_.Exception.Message)"
        Remove-Item $outFile -Force -ErrorAction SilentlyContinue
    }

    Start-Sleep -Seconds $DelaySeconds
}

# Save progress
$done | ConvertTo-Json | Set-Content $progressFile
Write-Output "Downloaded $count files. Progress saved."