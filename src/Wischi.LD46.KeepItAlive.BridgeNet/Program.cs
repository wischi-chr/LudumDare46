using Bridge;
using Bridge.Html5;
using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public static class Program
    {
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
                Console.WriteLine("Hugo Hugo");
            };

            xhr.Send();

            var water = new HTMLImageElement() { Src = "img/water.png" };
            var reset = new HTMLImageElement() { Src = "img/reset.png" };

            var config = TreeConfigurations.ReleaseConfig;

            var treeBehaviour = LoadFromLocalStorage(config);
            var app = new App(canvas, water, reset, treeBehaviour.Seed);

            water.AddEventListener(EventType.Load, () =>
            {
                Update();
                app.Redraw();
            });

            void Update()
            {
                treeBehaviour.Update(Date.Now());

                app.GrowthControl = treeBehaviour.Growth;
                app.WaterAmount = Math.Min(1, treeBehaviour.WaterLevel);
                app.ThicknessControl = treeBehaviour.Health;
                app.WaterDelta = treeBehaviour.WaterDelta;
                app.IsDead = treeBehaviour.Health == 0;

                SaveToLocalStorage(treeBehaviour, config, false);
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

                if (xx <= 80 && yy >= 430)
                {
                    if (treeBehaviour.Health == 0)
                    {
                        Window.LocalStorage.RemoveItem(config.SettingPrefix + ".Seed");
                        treeBehaviour = LoadFromLocalStorage(config);
                        app.UpdateSeed(treeBehaviour.Seed);
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

        private static void SaveToLocalStorage(TreeBehaviourEngine treeBehaviour, TreeConfiguration config, bool saveSeed)
        {
            var seedKey = config.SettingPrefix + ".Seed";
            var healthKey = config.SettingPrefix + ".Health";
            var waterLevelKey = config.SettingPrefix + ".WaterLevel";
            var growthKey = config.SettingPrefix + ".Growth";
            var tickKey = config.SettingPrefix + ".Ticks";
            var startKey = config.SettingPrefix + ".Start";
            var lastUpdateKey = config.SettingPrefix + ".LastUpdate";

            if (saveSeed)
            {
                Window.LocalStorage.SetItem(seedKey, treeBehaviour.Seed);
            }

            Window.LocalStorage.SetItem(healthKey, treeBehaviour.Health);
            Window.LocalStorage.SetItem(waterLevelKey, treeBehaviour.WaterLevel);
            Window.LocalStorage.SetItem(growthKey, treeBehaviour.Growth);
            Window.LocalStorage.SetItem(tickKey, treeBehaviour.Ticks);
            Window.LocalStorage.SetItem(startKey, treeBehaviour.Start);
            Window.LocalStorage.SetItem(lastUpdateKey, treeBehaviour.LastUpdate);
        }

        private static TreeBehaviourEngine LoadFromLocalStorage(TreeConfiguration config)
        {
            var seedKey = config.SettingPrefix + ".Seed";
            var healthKey = config.SettingPrefix + ".Health";
            var waterLevelKey = config.SettingPrefix + ".WaterLevel";
            var growthKey = config.SettingPrefix + ".Growth";
            var tickKey = config.SettingPrefix + ".Ticks";
            var startKey = config.SettingPrefix + ".Start";
            var lastUpdateKey = config.SettingPrefix + ".LastUpdate";

            var healthValue = Window.LocalStorage.GetItem(healthKey) as string;
            var seedValue = Window.LocalStorage.GetItem(seedKey) as string;
            var waterLevelValue = Window.LocalStorage.GetItem(waterLevelKey) as string;
            var growthValue = Window.LocalStorage.GetItem(growthKey) as string;
            var tickValue = Window.LocalStorage.GetItem(tickKey) as string;
            var startValue = Window.LocalStorage.GetItem(startKey) as string;
            var lastUpdateValue = Window.LocalStorage.GetItem(lastUpdateKey) as string;

            var resetTree = false;

            if (!int.TryParse(seedValue, out var seed))
            {
                seed = new Random().Next();
                resetTree = true;
            }

            if (!double.TryParse(healthValue, out var health) || resetTree)
            {
                health = 1;
            }

            if (!double.TryParse(waterLevelValue, out var waterLevel) || resetTree)
            {
                waterLevel = config.InitialWaterLevel;
            }

            if (!double.TryParse(growthValue, out var growth) || resetTree)
            {
                growth = 0;
            }

            if (!int.TryParse(tickValue, out var tick) || resetTree)
            {
                tick = 0;
            }

            if (!double.TryParse(startValue, out var start) || resetTree)
            {
                start = Date.Now();
            }

            if (!double.TryParse(lastUpdateValue, out var lastUpdate) || resetTree)
            {
                lastUpdate = Date.Now();
            }

            var behaviour = new TreeBehaviourEngine(config, start, lastUpdate, health, waterLevel, growth, tick, seed);
            SaveToLocalStorage(behaviour, config, true);
            return behaviour;
        }
    }
}
