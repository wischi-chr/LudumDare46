using Bridge;
using Bridge.Html5;
using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class Program
    {
        private static HTMLCanvasElement canvas;

        [Ready]
        public static void Main()
        {
            canvas = Document.GetElementById("canvas") as HTMLCanvasElement;

            if (canvas is null)
            {
                return;
            }

            var water = new HTMLImageElement() { Src = "img/water.png" };
            var reset = new HTMLImageElement() { Src = "img/reset.png" };

            var config = TreeConfigurations.ReleaseConfig;
            var startMs = Date.Now();

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

            var redrawTimer = Window.SetInterval(() =>
            {
                app.Redraw();
            }, config.MsRefreshRate);

            var tickTimer = Window.SetInterval(Update, config.MsTickRate);

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

    public static class TreeConfigurations
    {
        public static TreeConfiguration ReleaseConfig { get; }
            = new TreeConfigurationBuilder()
            {
                FullGrownTree = TimeSpan.FromDays(365 * 2), // two years
                TickRate = TimeSpan.FromMinutes(15),
                WaterMax = TimeSpan.FromDays(16),
                WaterMin = TimeSpan.FromDays(5),
                ScreenRefreshRate = TimeSpan.FromMinutes(1),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromDays(14),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromDays(14),
                InitialWaterLevel = 0.3,
                SettingPrefix = "bonsai"
            }.Build();

        public static TreeConfiguration DebugConfig { get; }
            = new TreeConfigurationBuilder()
            {
                FullGrownTree = TimeSpan.FromMinutes(1),
                TickRate = TimeSpan.FromMilliseconds(10),
                WaterMax = TimeSpan.FromSeconds(16),
                WaterMin = TimeSpan.FromSeconds(5),
                ScreenRefreshRate = TimeSpan.FromMilliseconds(100),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromSeconds(10),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromSeconds(10),
                InitialWaterLevel = 1,
                SettingPrefix = "debug"
            }.Build();


        public static TreeConfiguration LudumDare46Test { get; }
            = new TreeConfigurationBuilder()
            {
                FullGrownTree = TimeSpan.FromHours(2),
                TickRate = TimeSpan.FromMilliseconds(100),
                ScreenRefreshRate = TimeSpan.FromMilliseconds(1000),
                WaterMax = TimeSpan.FromMinutes(15),
                WaterMin = TimeSpan.FromMinutes(30),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromMinutes(15),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromMinutes(15),
                InitialWaterLevel = 0.3,
                SettingPrefix = "LD46"
            }.Build();
    }

    public class TreeConfigurationBuilder
    {
        public TimeSpan FullGrownTree { get; set; }
        public TimeSpan TickRate { get; set; }
        public TimeSpan WaterMin { get; set; }
        public TimeSpan WaterMax { get; set; }
        public TimeSpan DurationUntilDeadWhenUnhealthy { get; set; }
        public TimeSpan DurationUntilFullHealthWhenHealthy { get; set; }
        public TimeSpan ScreenRefreshRate { get; set; }
        public double InitialWaterLevel { get; set; }
        public string SettingPrefix { get; set; }

        public TreeConfiguration Build()
        {
            return new TreeConfiguration(
                GetPerTickValue(FullGrownTree),
                GetPerTickValue(WaterMin),
                GetPerTickValue(WaterMax),
                GetPerTickValue(DurationUntilFullHealthWhenHealthy),
                GetPerTickValue(DurationUntilDeadWhenUnhealthy),
                InitialWaterLevel,
                (int)Math.Round(ScreenRefreshRate.TotalMilliseconds),
                (int)Math.Round(TickRate.TotalMilliseconds),
                SettingPrefix
            );
        }

        private double GetPerTickValue(TimeSpan value)
        {
            return 1.0 / (value.TotalMilliseconds / TickRate.TotalMilliseconds);
        }
    }

    public class TreeConfiguration
    {
        public TreeConfiguration(
            double maxGrowthRate,
            double minWaterRate,
            double maxWaterRate,
            double healRate,
            double harmRate,
            double initialWaterLevel,
            int msRefreshRate,
            int msTickRate,
            string settingPrefix
        )
        {
            MaxGrowthRate = maxGrowthRate;
            MinWaterRate = minWaterRate;
            MaxWaterRate = maxWaterRate;
            HealRate = healRate;
            HarmRate = harmRate;
            InitialWaterLevel = initialWaterLevel;
            MsRefreshRate = msRefreshRate;
            MsTickRate = msTickRate;
            SettingPrefix = settingPrefix;
        }

        public double MaxGrowthRate { get; set; }
        public double MinWaterRate { get; set; }
        public double MaxWaterRate { get; set; }
        public double HealRate { get; set; }
        public double HarmRate { get; set; }
        public double InitialWaterLevel { get; }
        public int MsRefreshRate { get; }
        public int MsTickRate { get; }
        public string SettingPrefix { get; }
    }

    public class TreeBehaviourEngine
    {
        private readonly RandomWrapper rndSource;
        private readonly TreeConfiguration config;

        public TreeBehaviourEngine(TreeConfiguration config, double start, double lastUpdate, double health, double waterLevel, double growth, int ticks, int seed)
        {
            this.config = config;
            Start = start;
            LastUpdate = lastUpdate;
            Health = health;
            Growth = growth;
            Ticks = ticks;
            Seed = seed;
            WaterLevel = waterLevel;
            WaterDelta = 0.125;

            rndSource = new RandomWrapper(seed);
        }

        public double WaterDelta { get; private set; }
        public double WaterLevel { get; private set; }
        public double Start { get; }
        public double LastUpdate { get; private set; }
        public double Health { get; private set; }
        public double Growth { get; private set; }
        public int Ticks { get; private set; }
        public int Seed { get; }

        private bool IsHealthy => WaterLevel > 0.001 && WaterLevel <= 1;

        public void Water()
        {
            WaterLevel += WaterDelta;
        }

        public void Update(double now)
        {
            var targetTicks = (int)((now - Start) / config.MsTickRate);
            var delta = targetTicks - Ticks;

            for (var i = 0; i < delta; i++)
            {
                Tick();
            }

            LastUpdate = now;
        }

        private void Tick()
        {
            Ticks++;

            GrowthTick();
            WaterTick();
            HealthTick();
        }

        private void GrowthTick()
        {
            if (Growth >= 1)
            {
                Growth = 1;
            }
            else
            {
                Growth += config.MaxGrowthRate * Health;
            }
        }

        private void WaterTick()
        {
            var wDelta = config.MaxWaterRate - config.MinWaterRate;
            var waterAmount = rndSource.NextDouble() * wDelta + config.MinWaterRate;
            WaterLevel -= waterAmount;

            if (WaterLevel < 0)
            {
                WaterLevel = 0;
            }
        }

        private void HealthTick()
        {
            if (Health <= 0)
            {
                Health = 0;
                return;
            }

            if (IsHealthy)
            {
                Health += config.HealRate;
            }
            else
            {
                Health -= config.HarmRate;
            }

            if (Health < 0)
            {
                Health = 0;
            }
            else if (Health > 1)
            {
                Health = 1;
            }
        }
    }
}
