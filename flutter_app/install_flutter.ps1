# Define variables
$flutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.19.0-stable.zip"
$destDir = "C:\src"
$zipPath = "$env:TEMP\flutter.zip"
$flutterBin = "$destDir\flutter\bin"

Write-Host "Starting Flutter Installation..."

# Create directory
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir
    Write-Host "Created C:\src"
}

# Download
if (!(Test-Path "$destDir\flutter")) {
    Write-Host "Downloading Flutter SDK... (This may take a few minutes)"
    Invoke-WebRequest -Uri $flutterUrl -OutFile $zipPath
    
    Write-Host "Extracting..."
    Expand-Archive -Path $zipPath -DestinationPath $destDir -Force
    
    # Cleanup
    Remove-Item $zipPath
    Write-Host "Installed to $destDir\flutter"
} else {
    Write-Host "Flutter folder already exists in C:\src. Skipping download."
}

# Add to PATH (User)
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$flutterBin*") {
    $newPath = "$currentPath;$flutterBin"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added Flutter to User PATH."
} else {
    Write-Host "Flutter is already in User PATH."
}

# Verify
Write-Host "Installation script completed."
Write-Host "PLEASE RESTART YOUR TERMINAL (OR VSCODE) TO USE 'flutter' COMMAND."
