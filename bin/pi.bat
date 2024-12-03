@echo off
SET batchDir=%~dp0
REM Check if a parameter was provided
IF "%1"=="" (
    echo Please provide the command (ilib, ireact, or ireactlib)
    @REM exit /b
)

REM Check if the provided command is valid
IF NOT "%1"=="ilib" IF NOT "%1"=="ireact" IF NOT "%1"=="ireactlib" (
    echo Invalid command! Please use one of the following: ilib, ireact, ireactlib
    exit /b
)

REM Call the Node.js script located in ../src/ directory with the provided parameter
call node "%batchDir%..\src\%1.js" %*
