# 🔧 Docker Troubleshooting Guide for Windows

This guide helps resolve common Docker issues on Windows systems.

## 🚨 Common Issues & Solutions

### 1. Docker Desktop Not Running

**Error**: `The system cannot find the file specified` or `error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/images/...`

**Solution**:
1. **Start Docker Desktop**:
   - Search for "Docker Desktop" in Start menu
   - Click to open Docker Desktop
   - Wait for the green "Docker Desktop is running" status
   - This may take 1-2 minutes on first startup

2. **Check Docker Desktop Status**:
   - Look for the Docker whale icon in system tray
   - It should be green when running
   - If red, click to see error details

3. **Restart Docker Desktop**:
   - Right-click Docker icon in system tray
   - Select "Restart"
   - Wait for full restart

### 2. Port Conflicts

**Error**: `Ports are not available` or `address already in use`

**Solution**:
```powershell
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# Kill processes using those ports (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Alternative**: Change ports in `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Change 3000 to 3002
  - "3003:3001"  # Change 3001 to 3003
  - "5433:5432"  # Change 5432 to 5433
```

### 3. WSL2 Issues

**Error**: `WSL2 installation is incomplete` or Docker can't start

**Solution**:
1. **Enable WSL2**:
   ```powershell
   # Run as Administrator
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

2. **Install WSL2**:
   ```powershell
   wsl --install
   ```

3. **Set WSL2 as default**:
   ```powershell
   wsl --set-default-version 2
   ```

4. **Restart computer**

### 4. Hyper-V Issues

**Error**: `Hyper-V is not enabled` or virtualization errors

**Solution**:
1. **Enable Hyper-V** (Windows Pro/Enterprise):
   ```powershell
   # Run as Administrator
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   ```

2. **Enable Virtualization in BIOS**:
   - Restart computer
   - Enter BIOS (usually F2, F10, or Del)
   - Enable "Virtualization Technology" or "Intel VT-x"
   - Save and restart

### 5. Docker Service Issues

**Error**: `Docker service failed to start`

**Solution**:
1. **Restart Docker service**:
   ```powershell
   # Run as Administrator
   net stop com.docker.service
   net start com.docker.service
   ```

2. **Reset Docker Desktop**:
   - Open Docker Desktop
   - Go to Settings → Troubleshoot
   - Click "Reset to factory defaults"
   - Restart Docker Desktop

### 6. Permission Issues

**Error**: `Access denied` or permission errors

**Solution**:
1. **Run as Administrator**:
   - Right-click PowerShell/Command Prompt
   - Select "Run as administrator"

2. **Check file permissions**:
   ```powershell
   # Check current user
   whoami
   
   # Take ownership of project folder
   takeown /f "D:\Inventory Management Dashboard" /r /d y
   ```

### 7. Memory/Resource Issues

**Error**: `Insufficient memory` or containers fail to start

**Solution**:
1. **Increase Docker resources**:
   - Open Docker Desktop
   - Go to Settings → Resources
   - Increase Memory (recommend 4GB+)
   - Increase CPUs (recommend 2+)
   - Click "Apply & Restart"

2. **Close other applications**:
   - Close unnecessary browser tabs
   - Close other development tools
   - Free up system memory

## 🛠️ Diagnostic Commands

### Check Docker Status
```powershell
# Docker version
docker --version

# Docker info
docker info

# Docker system info
docker system info

# Check running containers
docker ps

# Check all containers
docker ps -a
```

### Check System Resources
```powershell
# Memory usage
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10

# Disk space
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace

# Network connections
netstat -an | findstr LISTENING
```

### Check Docker Logs
```powershell
# Docker Desktop logs
Get-EventLog -LogName Application -Source "Docker Desktop" -Newest 20

# Container logs
docker-compose logs
docker-compose logs postgres
docker-compose logs server
docker-compose logs client
```

## 🚀 Quick Fixes

### 1. Complete Reset
```powershell
# Stop all containers
docker-compose down -v

# Remove all images
docker system prune -a

# Restart Docker Desktop
# Then run:
docker-compose up --build
```

### 2. Clean Slate
```powershell
# Remove everything
docker-compose down -v
docker system prune -a --volumes
docker volume prune
docker network prune

# Restart Docker Desktop
# Then run:
docker-compose up --build
```

### 3. Alternative Ports
If ports 3000, 3001, or 5432 are busy:
```yaml
# Edit docker-compose.yml
ports:
  - "3002:3000"  # Frontend
  - "3003:3001"  # Backend
  - "5433:5432"  # Database
```

## 📞 Getting Help

### 1. Check Docker Status
- Look at Docker Desktop dashboard
- Check system tray icon color
- Review error messages in Docker Desktop

### 2. Common Solutions
- **Restart Docker Desktop** (fixes 80% of issues)
- **Restart computer** (fixes virtualization issues)
- **Check Windows updates** (ensures compatibility)

### 3. Advanced Help
- Docker Desktop logs: `%USERPROFILE%\AppData\Local\Docker\log.txt`
- Windows Event Viewer: Application logs
- Docker community forums

## 🔍 Prevention Tips

1. **Keep Docker Desktop updated**
2. **Restart Docker Desktop weekly**
3. **Don't run too many containers simultaneously**
4. **Monitor system resources**
5. **Use the startup scripts provided**

---

**Remember**: Most Docker issues on Windows are resolved by restarting Docker Desktop or the computer. Start with the simplest solutions first!
