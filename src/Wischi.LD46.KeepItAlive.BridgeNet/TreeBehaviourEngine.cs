namespace Wischi.LD46.KeepItAlive.BridgeNet
{
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
