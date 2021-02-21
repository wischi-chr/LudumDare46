using Bridge;
using Bridge.Html5;
using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public static class Program
    {
        private static readonly TreeEnvironmentConfig config;
        private static readonly ITreeStateStore treeStateStore;
        private static readonly TreeStateFactory treeStateFactory;

        static Program()
        {
            var rng = new Random();
            var clock = new BridgeClock();

            config = TreeEnvironmentConfigs.DebugConfig;
            treeStateStore = new LocalStorageTreeStateStore(config.SettingPrefix);
            treeStateFactory = new TreeStateFactory(rng, clock, config);
        }

        [Ready]
        public static void Main()
        {
            if (!(Document.GetElementById("canvas") is HTMLCanvasElement canvas))
            {
                // if canvas is missing, do nothing.
                return;
            }

            var xhr = new XMLHttpRequest();
            xhr.Open("POST", "https://api.keyvalue.xyz/new/hugo");
            xhr.OnLoad = a =>
            {
                Console.Write(xhr.ResponseText);
            };

            xhr.Send();

            var water = new HTMLImageElement() { Src = "img/water.png" };
            var reset = new HTMLImageElement() { Src = "img/reset.png" };

            var treeBehaviour = LoadBehaviour(config);
            var app = new App(canvas, water, reset, treeBehaviour.TreeState.Seed);

            water.AddEventListener(EventType.Load, () =>
            {
                Update();
                app.Redraw();
            });

            void Update()
            {
                treeBehaviour.Update(Date.Now());

                app.GrowthControl = treeBehaviour.TreeState.Growth;
                app.WaterAmount = Math.Min(1, treeBehaviour.TreeState.WaterLevel);
                app.ThicknessControl = treeBehaviour.TreeState.Health;
                app.WaterDelta = treeBehaviour.WaterDelta;
                app.IsDead = treeBehaviour.TreeState.Health == 0;

                treeStateStore.Set(treeBehaviour.TreeState);
            }

            canvas.AddEventListener(EventType.Click, (e) =>
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
                    if (treeBehaviour.TreeState.Health == 0)
                    {
                        // Reset Tree

                        Window.LocalStorage.RemoveItem(config.SettingPrefix + ".Seed");
                        treeBehaviour = LoadBehaviour(config);
                        app.UpdateSeed(treeBehaviour.TreeState.Seed);
                    }
                    else
                    {
                        treeBehaviour.Water();
                    }

                    Update();
                    app.Redraw();
                }
            });

            Window.SetInterval(
                () =>
                {
                    app.Redraw();
                },
                config.MsRefreshRate
            );

            Window.SetInterval(Update, config.MsTickRate);

            Update();
        }

        private static TreeBehaviourEngine LoadBehaviour(TreeEnvironmentConfig config)
        {
            var state = treeStateStore.Get();

            if (state is null)
            {
                state = treeStateFactory.CreateTree();
                treeStateStore.Set(state);
            }

            return new TreeBehaviourEngine(config, state);
        }
    }

    public class BridgeClock : IClock
    {
        public double Now()
        {
            return Date.Now();
        }
    }
}
