using Bridge;
using Bridge.Html5;
using System;
using System.Threading.Tasks;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public static class Bootstrap
    {
        private static readonly Random rng;
        private static readonly BridgeClock clock;
        private static readonly TreeEnvironmentConfig config;
        private static readonly TreeStateFactory treeStateFactory;
        private static readonly TreeStateStore treeStateStore;
        private static readonly SharedDrawingState sharedDrawingState;

        static Bootstrap()
        {
            rng = new Random();
            clock = new BridgeClock();
            config = TreeEnvironmentConfigs.Release;
            sharedDrawingState = new SharedDrawingState();

            treeStateFactory = new TreeStateFactory(rng, clock, config);
            treeStateStore = new TreeStateStore(config.SettingPrefix);
        }

        private static Task<HTMLImageElement> LoadImageAsync(string src)
        {
            var imageElement = new HTMLImageElement();
            var completionSource = new TaskCompletionSource<HTMLImageElement>();
            imageElement.Src = src;

            imageElement.AddEventListener(EventType.Load, () =>
            {
                completionSource.SetResult(imageElement);
            });

            return completionSource.Task;
        }

        private static async Task MigrateSettingsAsync()
        {
            var legacyStateStore = new LocalStorageLegacyTreeStateStore(config.SettingPrefix);

            var state = legacyStateStore.Get();

            if (state != null)
            {
                // migrate to new store
                await treeStateStore.Set(state);
                legacyStateStore.RemoveLegacy();
            }
        }

        private static void SetHashAsSyncToken()
        {
            var hs = Window.Location.Hash;

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
                Window.Location.Hash = "#" + treeStateStore.SyncToken;
            }
        }

        [Ready]
        public static async Task MainAsync()
        {
            if (!(Document.GetElementById("canvas") is HTMLCanvasElement canvas))
            {
                Console.Write("Canvas not found. Exiting.");
                return;
            }

            var loader = new LoadingDrawer(canvas);
            loader.Draw();

            await MigrateSettingsAsync();

            SetHashAsSyncToken();

            treeStateStore.SyncTokenChanged += (s, e) =>
            {
                Window.Location.Hash = "#" + treeStateStore.SyncToken;
            };

            var context = new TreeAppContext(
                clock,
                config,
                treeStateStore,
                treeStateFactory,
                sharedDrawingState
            );

            await context.InitializeAsync();
            context.UpdateGameState();

            var waterTask = LoadImageAsync("img/water.png");
            var resetTask = LoadImageAsync("img/reset.png");
            var autoSaveTask = context.AutoSave();

            await Task.WhenAll(waterTask, resetTask, autoSaveTask);

            var water = waterTask.Result;
            var reset = resetTask.Result;

            if (Document.GetElementById("slider") is HTMLInputElement slider)
            {
                slider.AddEventListener(EventType.Input, () =>
                {
                    var factor = int.Parse(slider.Value) / 100.0;
                    context.TreeBehaviour.TreeState.Growth = factor;
                });
            }

            var drawer = new TreeDrawer(canvas, water, reset, sharedDrawingState);

            Window.OnHashChange = async (_) =>
            {
                SetHashAsSyncToken();
                await context.InitializeAsync();
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

            water.AddEventListener(EventType.Load, UpdateStateAndDraw);

            canvas.AddEventListener(EventType.Click, async (e) =>
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
                        await context.ResetTreeAsync();
                    }
                    else
                    {
                        await context.WaterAsync();
                    }

                    UpdateStateAndDraw();
                }
            });

            Window.SetInterval(Draw, config.MsRefreshRate);
            Window.SetInterval(context.UpdateGameState, config.MsTickRate);
            Window.SetInterval(() => _ = context.AutoSave(), config.MsAutoSave);

            UpdateStateAndDraw();
        }
    }
}
