using System;
using H5;
using System.Threading.Tasks;
using Wischi.LD46.KeepItAlive.BridgeNet;

using static H5.Core.dom;
using static Tesserae.UI;

namespace Wischi.LD46.KeepItAlive.WebH5
{
    class Program
    {
        private static readonly Random rng;
        private static readonly BrowserJsClock clock;
        private static readonly TreeEnvironmentConfig config;
        private static readonly TreeStateFactory treeStateFactory;
        private static readonly TreeStateStore treeStateStore;
        private static readonly SharedDrawingState sharedDrawingState;

        static Program()
        {
            rng = new Random();
            clock = new BrowserJsClock();
            config = TreeEnvironmentConfigs.Release;
            sharedDrawingState = new SharedDrawingState();

            treeStateFactory = new TreeStateFactory(rng, clock, config);
            treeStateStore = new TreeStateStore(config.SettingPrefix);
        }

        private static Task<HTMLImageElement> LoadImageAsync(string src)
        {
            var imageElement = new HTMLImageElement();
            var completionSource = new TaskCompletionSource<HTMLImageElement>();
            imageElement.src = src;

            imageElement.addEventListener("load", () =>
            {
                completionSource.SetResult(imageElement);
            });

            return completionSource.Task;
        }

        private static void MigrateSettings()
        {
            var legacyStateStore = new LocalStorageLegacyTreeStateStore(config.SettingPrefix);

            var state = legacyStateStore.Get();

            if (state != null)
            {
                // migrate to new store
                treeStateStore.Set(state);
                legacyStateStore.RemoveLegacy();
            }
        }

        private static void SetHashAsSyncToken()
        {
            var hs = window.location.hash;

            if (hs.StartsWith("#"))
            {
                hs = hs.Substring(1);
            }

            if (!string.IsNullOrWhiteSpace(hs))
            {
                treeStateStore.SyncToken = hs;
            }
            else
            {
                window.location.hash = "#" + treeStateStore.SyncToken;
            }
        }

        static async Task Main(string[] args)
        {
            SetupHtml();

            if (!(document.getElementById("canvas") is HTMLCanvasElement canvas))
            {
                console.error("Canvas not found. Exiting.");
                return;
            }

            var loader = new LoadingDrawer(canvas);
            loader.Draw();

            MigrateSettings();
            SetHashAsSyncToken();

            treeStateStore.SyncTokenChanged += (s, e) =>
            {
                window.location.hash = "#" + treeStateStore.SyncToken;
            };

            var context = new TreeAppContext(
                clock,
                config,
                treeStateStore,
                treeStateFactory,
                sharedDrawingState
            );

            context.Initialize();
            context.UpdateGameState();

            var waterTask = LoadImageAsync("img/water.png");
            var resetTask = LoadImageAsync("img/reset.png");
            context.AutoSave();

            await Task.WhenAll(waterTask, resetTask);

            var water = waterTask.Result;
            var reset = resetTask.Result;

            if (document.getElementById("slider") is HTMLInputElement slider)
            {
                slider.addEventListener("input", () =>
                {
                    var factor = int.Parse(slider.value) / 100.0;
                    context.TreeBehaviour.TreeState.Growth = factor;
                });
            }

            var drawer = new TreeDrawer(canvas, water, reset, sharedDrawingState);

            window.onhashchange = (_) =>
            {
                SetHashAsSyncToken();
                context.Initialize();
                UpdateStateAndDraw();
            };

            void Draw()
            {
                context.UpdatePreRender();
                drawer.Draw();
            }

            void UpdateStateAndDraw()
            {
                context.UpdateGameState();
                Draw();
            }

            water.addEventListener("load", UpdateStateAndDraw);

            canvas.addEventListener("click", (e) =>
            {
                if (!(e is MouseEvent me))
                {
                    return;
                }

                Script.Write("var rect = e.target.getBoundingClientRect();");
                Script.Write("var x = Math.floor(e.clientX - rect.left);");
                Script.Write("var y = Math.floor(e.clientY - rect.top);");

                var xx = Script.Get<int>("x");
                var yy = Script.Get<int>("y");

                // Hit-Test for "button"
                if (xx <= 80 && yy >= 430)
                {
                    if (context.TreeBehaviour.TreeState.Health == 0)
                    {
                        // Reset Tree
                        context.ResetTree();
                    }
                    else
                    {
                        context.Water();
                    }

                    UpdateStateAndDraw();
                }
            });

            window.setInterval(_ => Draw(), config.MsRefreshRate);
            window.setInterval(_ => context.UpdateGameState(), config.MsTickRate);
            window.setInterval(_ => context.AutoSave(), config.MsAutoSave);

            UpdateStateAndDraw();
        }

        private static void SetupHtml()
        {
            document.title = "🌳 - ZenTuree";
            var bs = document.body.style;

            bs.margin = "0px";
            bs.padding = "0px";
            bs.backgroundColor = "#333";

            var screen = Canvas(_(
                id: "canvas",
                styles: s =>
                {
                    s.border = "solid 5px black";
                }));

            screen.setAttribute("width", "512");
            screen.setAttribute("height", "512");

            var center_div = Div(_(
                styles: s =>
                {
                    s.position = "fixed";
                    s.top = "50%";
                    s.left = "50%";
                    s.transform = "translate(-50%, -50%)";
                }),
                screen
            );

            document.body.appendChild(center_div);
        }
    }
}
