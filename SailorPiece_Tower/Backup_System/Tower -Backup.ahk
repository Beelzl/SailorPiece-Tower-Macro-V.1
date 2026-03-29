    #SingleInstance Force
    #Persistent

    CoordMode, Pixel, Screen
    CoordMode, Mouse, Screen

    macroRunning := false
    isRunning := false

    ; กำหนดตำแหน่ง (แก้เองได้)
    pos1x := 730
    pos1y := 476
    pos2x := 1190
    pos2y := 479

    Gui, +AlwaysOnTop +ToolWindow
    Gui, Font, s10
    Gui, Add, Text,, 😌 Use wisely Niggas
    Gui, Add, Text, vStatus w180 Center, Status: STOPPED
    Gui, Add, Text, vTimer w180 Center, Time: 00:00:00
    Gui, Show, AutoSize Center

    F8::
        macroRunning := !macroRunning
        if (macroRunning)
        {
            startMacroTime := A_TickCount
            GuiControl,, Status, Status: RUNNING
            SetTimer, RunMacro, 100
            SetTimer, UpdateTimer, 1000
        }
        else
        {
            GuiControl,, Status, Status: STOPPED
            SetTimer, RunMacro, Off
            SetTimer, UpdateTimer, Off

            GuiControl,, Timer, Time: 00:00:00  ;
        }
    return


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
        isRunning := false
    return

    UpdateTimer:  
        elapsed := A_TickCount - startMacroTime

        totalSec := Floor(elapsed / 1000)
        hours := Floor(totalSec / 3600)
        minutes := Floor(Mod(totalSec, 3600) / 60)
        seconds := Mod(totalSec, 60)

        FormatTimeText := Format("{:02}:{:02}:{:02}", hours, minutes, seconds)
        GuiControl,, Timer, Time: %FormatTimeText%
    return


    GuiClose:
    F9::ExitApp