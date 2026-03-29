#SingleInstance Force
#Persistent

CoordMode, Pixel, Screen
CoordMode, Mouse, Screen

macroRunning := false
isRunning := false

pos1x := 730
pos1y := 476
pos2x := 1190
pos2y := 479

clearCount := 0


RegWrite, REG_DWORD, HKCU, Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION, %A_ScriptName%, 11001

Gui, -Caption +AlwaysOnTop
Gui, Color, f0c8e8
Gui, Add, ActiveX, vWB w300 h240, Shell.Explorer
Gui, Show, w300 h240, Tower-Automation

WB.Navigate(A_ScriptDir . "\index.html")
ComObjConnect(WB, "WB_")

hWnd := WinExist("Tower-Automation")
DllCall("dwmapi\DwmSetWindowAttribute", "ptr", hWnd, "uint", 33, "uint*", 2, "uint", 4)
return

WB_DocumentComplete(pDisp, url) {
    return
}

WB_BeforeNavigate2(pDisp, url, flags, frame, data, headers, cancel) {
    if (InStr(url, "ahk:")) {
        cancel[] := true
        msg := SubStr(url, InStr(url, "ahk:") + 4)
        if (msg = "exit")
            ExitApp
        else if (msg = "drag")
            PostMessage, 0xA1, 2,,, Tower-Automation
        else
            ReceiveMessage(msg)
    }
}

ReceiveMessage(msg) {
    global macroRunning, startMacroTime

    if (msg = "start") {
        macroRunning := true
        startMacroTime := A_TickCount
        SetTimer, RunMacro, 100
        SetTimer, UpdateTimer, 1000
    }
    else if (msg = "stop") {
        macroRunning := false
        SetTimer, RunMacro, Off
        SetTimer, UpdateTimer, Off
        clearCount := 0
    }
}

RunMacro:
if (!macroRunning || isRunning)
    return

isRunning := true
startTime := A_TickCount

while (A_TickCount - startTime < 465000)
{
    if (!macroRunning)
        break

    Random, speed, 5, 10
    MouseMove, %pos1x%, %pos1y%, %speed%
    Click
    Sleep, 600
    SendInput, 1
    Sleep, 200

    Random, speed, 5, 10
    MouseMove, %pos2x%, %pos2y%, %speed%
    Click
    Sleep, 600
    SendInput, 1
    Sleep, 200
}

Loop, 5
{
    if (!macroRunning)
        break

    Send, {Esc}
    Sleep, 500
    Send, {r down}
    Sleep, 50
    Send, {r up}
    Sleep, 300
    Send, {Enter}
    Sleep, 3800
}

clearCount++
WB.document.parentWindow.eval("document.getElementById('clear-count').innerText = 'Clear: " . clearCount . "';")

isRunning := false
return

UpdateTimer:
elapsed := A_TickCount - startMacroTime

totalSec := Floor(elapsed / 1000)
hours := Floor(totalSec / 3600)
minutes := Floor(Mod(totalSec, 3600) / 60)
seconds := Mod(totalSec, 60)

timeText := Format("{:02}:{:02}:{:02}", hours, minutes, seconds)

WB.document.parentWindow.eval("document.getElementById('timer').innerText = '" . timeText . "';")
return

F8::
    if (macroRunning) {
        macroRunning := false
        SetTimer, RunMacro, Off
        SetTimer, UpdateTimer, Off
        clearCount := 0
        WB.document.parentWindow.eval("setStatus('stopped');document.getElementById('timer').innerText='--:--:--';document.getElementById('clear-count').innerText='Clear: 0';")
    } else {
        macroRunning := true
        startMacroTime := A_TickCount
        SetTimer, RunMacro, 100
        SetTimer, UpdateTimer, 1000
        WB.document.parentWindow.eval("setStatus('running');")
    }
return

F9::
GuiClose:
ExitApp
