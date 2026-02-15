@ECHO off
GOTO start

:find_dp0
SET dp0=%~dp0
EXIT /b

:start
SETLOCAL
CALL :find_dp0

REM Check if bun exists locally
IF EXIST "%dp0%\bun.exe" (
  SET "_prog=%dp0%\bun.exe"
) ELSE (
  REM Check if bun is in the system PATH
  WHERE bun >nul 2>nul
  IF ERRORLEVEL 1 (
    ECHO Error: bun not found in PATH or locally
    EXIT /b 1
  )
  SET "_prog=bun"
)

REM Run TypeScript file
"%_prog%" run "%dp0%\scripts\locale.ts" %*