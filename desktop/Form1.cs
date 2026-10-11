using System;
using System.Drawing;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace VoicelineDesktop;

public partial class Form1 : Form
{
    private WebView2? webView;
    private string activeServerUrl = "http://localhost:3000";
    private readonly string configFilePath;
    private readonly string localServerTxtPath;
    private string clientFolderPath = "";

    public Form1()
    {
        InitializeComponent();

        string appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        configFilePath = Path.Combine(appData, "VoicelineDesktop", "server_url.txt");
        localServerTxtPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "server.txt");

        ConfigureWindow();
        InitializeWebViewAsync();
    }

    private void ConfigureWindow()
    {
        this.Text = "Voiceline";
        this.Size = new Size(1320, 840);
        this.MinimumSize = new Size(820, 560);
        this.StartPosition = FormStartPosition.CenterScreen;
        this.BackColor = Color.FromArgb(30, 31, 34); // Discord #1e1f22
        this.KeyPreview = true;
        this.KeyDown += Form1_KeyDown;
    }

    private void Form1_KeyDown(object? sender, KeyEventArgs e)
    {
        if (e.KeyCode == Keys.F2 || (e.Control && e.Shift && e.KeyCode == Keys.S))
        {
            e.Handled = true;
            PromptChangeServer();
        }
    }

    private void PromptChangeServer()
    {
        using var prompt = new Form
        {
            Width = 460,
            Height = 220,
            FormBorderStyle = FormBorderStyle.FixedDialog,
            Text = "Change Server Address",
            StartPosition = FormStartPosition.CenterParent,
            BackColor = Color.FromArgb(43, 45, 49),
            ForeColor = Color.White,
            MaximizeBox = false,
            MinimizeBox = false
        };

        var label = new Label
        {
            Left = 24,
            Top = 20,
            Width = 400,
            Text = "Enter host server URL (e.g. https://xxxx.trycloudflare.com or http://localhost:3000):",
            ForeColor = Color.FromArgb(181, 186, 193)
        };

        var textBox = new TextBox
        {
            Left = 24,
            Top = 55,
            Width = 396,
            Text = activeServerUrl,
            BackColor = Color.FromArgb(30, 31, 34),
            ForeColor = Color.White,
            BorderStyle = BorderStyle.FixedSingle
        };

        var btnOk = new Button
        {
            Text = "Save & Connect",
            Left = 270,
            Top = 115,
            Width = 150,
            Height = 36,
            DialogResult = DialogResult.OK,
            BackColor = Color.FromArgb(88, 101, 242),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat
        };

        var btnLocalhost = new Button
        {
            Text = "Host (localhost)",
            Left = 24,
            Top = 115,
            Width = 140,
            Height = 36,
            BackColor = Color.FromArgb(53, 55, 60),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat
        };
        btnLocalhost.Click += (s, ev) =>
        {
            textBox.Text = "http://localhost:3000";
        };

        prompt.Controls.Add(label);
        prompt.Controls.Add(textBox);
        prompt.Controls.Add(btnOk);
        prompt.Controls.Add(btnLocalhost);
        prompt.AcceptButton = btnOk;

        if (prompt.ShowDialog(this) == DialogResult.OK)
        {
            string newUrl = SanitizeUrl(textBox.Text);
            if (!string.IsNullOrWhiteSpace(newUrl))
            {
                activeServerUrl = newUrl;
                SaveServerUrl(newUrl);
                ReloadWithServer(newUrl);
            }
        }
    }

    private string ResolveInitialServerUrl()
    {
        // 1. Check if server.txt exists next to Voiceline.exe
        if (File.Exists(localServerTxtPath))
        {
            string fromLocal = File.ReadAllText(localServerTxtPath).Trim();
            if (!string.IsNullOrWhiteSpace(fromLocal)) return SanitizeUrl(fromLocal);
        }

        // 2. Check saved server_url.txt in AppData
        if (File.Exists(configFilePath))
        {
            string saved = File.ReadAllText(configFilePath).Trim();
            if (!string.IsNullOrWhiteSpace(saved)) return SanitizeUrl(saved);
        }

        // 3. If running on host PC and localhost:3000 is alive
        if (IsServerAlive("http://localhost:3000"))
        {
            return "http://localhost:3000";
        }

        // 4. Default tunnel link
        return "https://scholar-away-cycles-journalism.trycloudflare.com";
    }

    private bool IsServerAlive(string url)
    {
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(600) };
            string checkUrl = url.TrimEnd('/') + "/api/health";
            var res = client.GetAsync(checkUrl).GetAwaiter().GetResult();
            return res.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    private string SanitizeUrl(string input)
    {
        input = input.Trim();
        if (!input.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
            !input.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            input = "https://" + input;
        }
        return input.TrimEnd('/');
    }

    private void SaveServerUrl(string url)
    {
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(configFilePath)!);
            File.WriteAllText(configFilePath, url);
        }
        catch {}
    }

    private string FindClientDirectory()
    {
        // 1. In published app folder: ./client
        string inApp = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "client");
        if (Directory.Exists(inApp)) return inApp;

        // 2. In dev project root: ../client or ../../client
        string current = AppDomain.CurrentDomain.BaseDirectory;
        for (int i = 0; i < 5; i++)
        {
            string candidate = Path.Combine(current, "client");
            if (Directory.Exists(candidate) && File.Exists(Path.Combine(candidate, "index.html")))
            {
                return candidate;
            }
            DirectoryInfo? parent = Directory.GetParent(current);
            if (parent == null) break;
            current = parent.FullName;
        }

        return inApp;
    }

    private async void InitializeWebViewAsync()
    {
        try
        {
            webView = new WebView2
            {
                Dock = DockStyle.Fill
            };
            this.Controls.Add(webView);

            string appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string userDataFolder = Path.Combine(appData, "VoicelineDesktop", "WebViewProfile");
            Directory.CreateDirectory(userDataFolder);

            var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
            await webView.EnsureCoreWebView2Async(env);

            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
            webView.CoreWebView2.Settings.AreDevToolsEnabled = true;

            // Diagnostic listeners
            webView.NavigationCompleted += (s, e) => Log($"NavigationCompleted: Success={e.IsSuccess}, ErrorStatus={e.WebErrorStatus}");
            webView.CoreWebView2.ProcessFailed += (s, e) => Log($"ProcessFailed: ExitCode={e.ExitCode}, Kind={e.ProcessFailedKind}");
            this.FormClosing += (s, e) => Log($"FormClosing: Reason={e.CloseReason}, Cancel={e.Cancel}");
            this.FormClosed += (s, e) => Log($"FormClosed: Reason={e.CloseReason}");

            clientFolderPath = FindClientDirectory();

            // Native Asset Mapping: The frontend loads 100% offline from local disk!
            // This is the exact mechanism Tauri uses on Windows (Virtual Host Mapping).
            webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "app.voiceline.local",
                clientFolderPath,
                CoreWebView2HostResourceAccessKind.Allow
            );

            activeServerUrl = ResolveInitialServerUrl();
            SaveServerUrl(activeServerUrl);

            ReloadWithServer(activeServerUrl);
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"Failed to initialize WebView2:\n\n{ex.Message}\n\nPlease ensure Microsoft Edge WebView2 Runtime is installed.",
                "Voiceline Error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
        }
    }

    private void Log(string message)
    {
        try
        {
            string dir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "VoicelineDesktop");
            Directory.CreateDirectory(dir);
            File.AppendAllText(Path.Combine(dir, "app.log"), $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}\n");
        }
        catch {}
    }

    private async void ReloadWithServer(string serverUrl)
    {
        try
        {
            if (webView?.CoreWebView2 == null) return;

            Log($"Reloading with server: {serverUrl}, clientFolder: {clientFolderPath}");

            string initScript = $@"
                window.VOICELINE_SERVER_URL = '{serverUrl}';
                window.IS_DESKTOP_APP = true;
            ";
            await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(initScript);

            this.Text = "Voiceline";
            webView.CoreWebView2.Navigate("https://app.voiceline.local/index.html");
        }
        catch (Exception ex)
        {
            Log($"Error in ReloadWithServer: {ex}");
        }
    }
}
