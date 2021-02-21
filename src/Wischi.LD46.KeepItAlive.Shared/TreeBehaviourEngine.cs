namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeBehaviourEngine
    {
        private readonly RandomWrapper rndSource;
        private readonly TreeEnvironmentConfig config;

        public TreeBehaviourEngine(TreeEnvironmentConfig config, TreeState treeState)
        {
            this.config = config ?? throw new System.ArgumentNullException(nameof(config));
            this.TreeState = treeState ?? throw new System.ArgumentNullException(nameof(treeState));

            WaterDelta = 0.125;
            rndSource = new RandomWrapper(treeState.Seed);
        }

        public double WaterDelta { get; private set; }
        public TreeState TreeState { get; }

        private bool IsHealthy => TreeState.WaterLevel > 0.001 && TreeState.WaterLevel <= 1;


        public void Water()
        {
            TreeState.WaterLevel += WaterDelta;
        }

        public void Update(double now)
        {
            var targetTicks = (int)((now - TreeState.StartTimestamp) / config.MsTickRate);
            var delta = targetTicks - TreeState.Ticks;

            for (var i = 0; i < delta; i++)
            {
                Tick();

                if (TreeState.Health <= 0)
                {
                    // stop processing ticks, tree is dead already.
                    // This prevents lag if the tree wasn't opened for a long time
                    break;
                }
            }

            TreeState.LastEventTimestamp = now;
        }

        private void Tick()
        {
            TreeState.Ticks++;

            GrowthTick();
            WaterTick();
            HealthTick();
        }

        private void GrowthTick()
        {
            if (TreeState.Growth >= 1)
            {
                TreeState.Growth = 1;
            }
            else
            {
                TreeState.Growth += config.MaxGrowthRate * TreeState.Health;
            }
        }

        private void WaterTick()
        {
            var wDelta = config.MaxWaterRate - config.MinWaterRate;
            var waterAmount = rndSource.NextDouble() * wDelta + config.MinWaterRate;
            TreeState.WaterLevel -= waterAmount;

            if (TreeState.WaterLevel < 0)
            {
                TreeState.WaterLevel = 0;
            }
        }

        private void HealthTick()
        {
            if (TreeState.Health <= 0)
            {
                TreeState.Health = 0;
                return;
            }

            if (IsHealthy)
            {
                TreeState.Health += config.HealRate;
            }
            else
            {
                TreeState.Health -= config.HarmRate;
            }

            if (TreeState.Health < 0)
            {
                TreeState.Health = 0;
            }
            else if (TreeState.Health > 1)
            {
                TreeState.Health = 1;
            }
        }
    }
}
