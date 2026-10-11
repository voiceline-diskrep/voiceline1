using System;
using System.IO;
using System.Windows.Forms;

namespace VoicelineDesktop;

static class Program
{
    [STAThread]
    static void Main()
    {
        Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
        AppDomain.CurrentDomain.UnhandledException += (s, e) =>
        {
            File.WriteAllText("desktop_crash.log", e.ExceptionObject?.ToString());
        };
        Application.ThreadException += (s, e) =>
        {
            File.WriteAllText("desktop_crash.log", e.Exception?.ToString());
        };

        try
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
        catch (Exception ex)
        {
            File.WriteAllText("desktop_crash.log", ex.ToString());
        }
    }    
}